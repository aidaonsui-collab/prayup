// Two-way sync between localStorage state and the prayup.* tables on Supabase.
// On sign-in: pull DB rows, merge into localStorage (DB wins on conflicts).
// On local writes: push individual rows to DB (best-effort; offline = retry next change).

import { supabase } from './supabase';
import { getAllEntries, type RitualEntry } from './journey';
import { getProfile, getSavedPrayers, type Profile, type SavedPrayer, updateProfile } from './profile';

type DBProfile = {
  id: string;
  display_name: string | null;
  focus_areas: string[];
  carrying: string[];
  reminder_time: string | null;
  reminder_enabled: boolean;
};

type DBEntry = {
  id: string;
  user_id: string;
  date: string;
  mood: string;
  template: string;
  heart: string | null;
  intention: string | null;
  reflection: string | null;
  verse_ref: string | null;
  completed_at: string;
};

type DBSaved = {
  id: string;
  user_id: string;
  prayer_text: string;
  template: string | null;
  mood: string | null;
  verse_ref: string | null;
  created_at: string;
};

function entryToDB(userId: string, e: RitualEntry): Omit<DBEntry, 'id'> {
  return {
    user_id: userId,
    date: e.date,
    mood: e.mood,
    template: e.template,
    heart: e.heart ?? null,
    intention: e.intention ?? null,
    reflection: e.reflection ?? null,
    verse_ref: e.verseRef ?? null,
    completed_at: new Date(e.completedAt).toISOString(),
  };
}

function dbToEntry(d: DBEntry): RitualEntry {
  return {
    date: d.date,
    mood: d.mood as RitualEntry['mood'],
    template: d.template as RitualEntry['template'],
    heart: d.heart ?? undefined,
    intention: d.intention ?? undefined,
    reflection: d.reflection ?? undefined,
    verseRef: d.verse_ref ?? undefined,
    completedAt: new Date(d.completed_at).getTime(),
  };
}

function dbToProfile(d: DBProfile): Partial<Profile> {
  return {
    displayName: d.display_name ?? '',
    focusAreas: d.focus_areas ?? [],
    carrying: d.carrying ?? [],
    reminderEnabled: d.reminder_enabled,
    reminderTime: d.reminder_time ?? '07:00',
  };
}

const ENTRIES_KEY = 'prayup.journey.entries';
const SAVED_KEY = 'prayup.saved-prayers';

function writeLocalEntries(entries: RitualEntry[]) {
  localStorage.setItem(ENTRIES_KEY, JSON.stringify(entries));
  window.dispatchEvent(new Event('prayup:journey-change'));
}
function writeLocalSaved(list: SavedPrayer[]) {
  localStorage.setItem(SAVED_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('prayup:saved-change'));
}

// ── Pull from DB → merge into localStorage ───────────────────────────────
export async function pullFromDB(userId: string) {
  if (!supabase) return;

  // Profile
  const { data: profileRow } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (profileRow) {
    updateProfile(dbToProfile(profileRow as DBProfile));
  } else {
    // First sign-in: seed a profile row from current local state.
    const local = getProfile();
    await supabase.from('profiles').upsert({
      id: userId,
      display_name: local.displayName || null,
      focus_areas: local.focusAreas,
      carrying: local.carrying,
      reminder_time: local.reminderTime,
      reminder_enabled: local.reminderEnabled,
    });
  }

  // Ritual entries — DB wins for any same-date conflicts.
  const { data: dbEntries } = await supabase
    .from('ritual_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
  if (dbEntries) {
    const local = getAllEntries();
    const byDate = new Map(local.map((e) => [e.date, e]));
    for (const row of dbEntries as DBEntry[]) {
      byDate.set(row.date, dbToEntry(row));
    }
    const merged = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
    writeLocalEntries(merged);

    // Push any local-only entries (no DB row for that date) up.
    const dbDates = new Set((dbEntries as DBEntry[]).map((r) => r.date));
    const toPush = local.filter((e) => !dbDates.has(e.date)).map((e) => entryToDB(userId, e));
    if (toPush.length) {
      await supabase.from('ritual_entries').upsert(toPush, { onConflict: 'user_id,date' });
    }
  }

  // Saved prayers — append-only, dedupe by exact text.
  const { data: dbSaved } = await supabase
    .from('saved_prayers')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (dbSaved) {
    const local = getSavedPrayers();
    const seen = new Set(local.map((s) => s.text));
    const remoteMerged: SavedPrayer[] = (dbSaved as DBSaved[]).map((d) => ({
      id: d.id,
      text: d.prayer_text,
      template: d.template ?? '',
      mood: d.mood ?? '',
      verseRef: d.verse_ref ?? undefined,
      savedAt: new Date(d.created_at).getTime(),
    }));
    const combined = [...remoteMerged, ...local.filter((l) => !remoteMerged.some((r) => r.text === l.text))];
    writeLocalSaved(combined);

    const toUpload = local.filter((l) => !(dbSaved as DBSaved[]).some((r) => r.prayer_text === l.text));
    if (toUpload.length) {
      await supabase.from('saved_prayers').insert(toUpload.map((s) => ({
        user_id: userId,
        prayer_text: s.text,
        template: s.template || null,
        mood: s.mood || null,
        verse_ref: s.verseRef ?? null,
      })));
    }
    void seen;
  }
}

// ── Push individual changes ──────────────────────────────────────────────
export async function pushProfile(userId: string, profile: Profile) {
  if (!supabase) return;
  await supabase.from('profiles').upsert({
    id: userId,
    display_name: profile.displayName || null,
    focus_areas: profile.focusAreas,
    carrying: profile.carrying,
    reminder_time: profile.reminderTime,
    reminder_enabled: profile.reminderEnabled,
  });
}

export async function pushEntry(userId: string, entry: RitualEntry) {
  if (!supabase) return;
  await supabase.from('ritual_entries').upsert(entryToDB(userId, entry), { onConflict: 'user_id,date' });
}

export async function pushSavedPrayer(userId: string, s: SavedPrayer) {
  if (!supabase) return;
  await supabase.from('saved_prayers').insert({
    user_id: userId,
    prayer_text: s.text,
    template: s.template || null,
    mood: s.mood || null,
    verse_ref: s.verseRef ?? null,
  });
}

// Hook: when a user signs in, run pullFromDB once; thereafter, listen to
// local-change events and push the latest snapshot up.
import { useEffect } from 'react';

export function useSync(userId: string | null) {
  useEffect(() => {
    if (!userId || !supabase) return;
    void pullFromDB(userId);

    const onProfile = () => { void pushProfile(userId, getProfile()); };
    const onJourney = () => {
      // push the most-recent entry (today's)
      const all = getAllEntries();
      const todayIso = new Date().toISOString().slice(0, 10);
      const entry = all.find((e) => e.date === todayIso);
      if (entry) void pushEntry(userId, entry);
    };
    const onSaved = () => {
      // push the newest saved prayer
      const list = getSavedPrayers();
      if (list[0]) void pushSavedPrayer(userId, list[0]);
    };

    window.addEventListener('prayup:profile-change', onProfile);
    window.addEventListener('prayup:journey-change', onJourney);
    window.addEventListener('prayup:saved-change', onSaved);
    return () => {
      window.removeEventListener('prayup:profile-change', onProfile);
      window.removeEventListener('prayup:journey-change', onJourney);
      window.removeEventListener('prayup:saved-change', onSaved);
    };
  }, [userId]);
}
