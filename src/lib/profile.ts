// User profile + preferences. localStorage-backed; sync to Supabase when authed.

import { useEffect, useState } from 'react';

export type Profile = {
  displayName: string;
  focusAreas: string[];
  carrying: string[];
  reminderEnabled: boolean;
  reminderTime: string; // 'HH:MM' 24h
};

export type SavedPrayer = {
  id: string;
  text: string;
  template: string;
  mood: string;
  verseRef?: string;
  savedAt: number;
};

const PROFILE_KEY = 'prayup.profile';
const SAVED_KEY = 'prayup.saved-prayers';

const DEFAULT_PROFILE: Profile = {
  displayName: '',
  focusAreas: [],
  carrying: [],
  reminderEnabled: false,
  reminderTime: '07:00',
};

export const FOCUS_AREA_OPTIONS = [
  'Anxiety', 'Work', 'Family', 'Healing',
  'Patience', 'Gratitude', 'Direction', 'Marriage',
  'Parenting', 'Grief', 'Finances', 'Purpose',
];

function readProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROFILE, ...parsed };
  } catch {
    return { ...DEFAULT_PROFILE };
  }
}

function writeProfile(p: Profile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    window.dispatchEvent(new Event('prayup:profile-change'));
  } catch {
    // ignore quota / private-mode failures
  }
}

export function getProfile(): Profile {
  return readProfile();
}

export function updateProfile(patch: Partial<Profile>) {
  writeProfile({ ...readProfile(), ...patch });
}

export function getDisplayName(fallback = 'friend'): string {
  const name = readProfile().displayName.trim();
  return name || fallback;
}

export function useProfile(): [Profile, (patch: Partial<Profile>) => void] {
  const [p, setP] = useState<Profile>(readProfile);
  useEffect(() => {
    const onChange = () => setP(readProfile());
    const onStorage = (e: StorageEvent) => { if (e.key === PROFILE_KEY) setP(readProfile()); };
    window.addEventListener('prayup:profile-change', onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('prayup:profile-change', onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  const set = (patch: Partial<Profile>) => updateProfile(patch);
  return [p, set];
}

// ── Saved prayers ────────────────────────────────────────────────────────

function readSaved(): SavedPrayer[] {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as SavedPrayer[] : [];
  } catch {
    return [];
  }
}

function writeSaved(list: SavedPrayer[]) {
  try {
    localStorage.setItem(SAVED_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event('prayup:saved-change'));
  } catch {
    // ignore
  }
}

export function getSavedPrayers(): SavedPrayer[] {
  return readSaved();
}

export function savePrayer(p: Omit<SavedPrayer, 'id' | 'savedAt'>): SavedPrayer {
  const entry: SavedPrayer = {
    ...p,
    id: crypto.randomUUID(),
    savedAt: Date.now(),
  };
  const list = readSaved();
  list.unshift(entry);
  writeSaved(list);
  return entry;
}

export function deleteSavedPrayer(id: string) {
  writeSaved(readSaved().filter((p) => p.id !== id));
}

export function isPrayerSaved(text: string): boolean {
  return readSaved().some((p) => p.text === text);
}

export function useSavedPrayers(): SavedPrayer[] {
  const [list, setList] = useState<SavedPrayer[]>(readSaved);
  useEffect(() => {
    const onChange = () => setList(readSaved());
    const onStorage = (e: StorageEvent) => { if (e.key === SAVED_KEY) setList(readSaved()); };
    window.addEventListener('prayup:saved-change', onChange);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('prayup:saved-change', onChange);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return list;
}
