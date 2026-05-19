// Ritual history. Derives streaks/insights from completed rituals stored in
// localStorage. One entry per completed ritual, keyed by the day.

import type { MoodId, TemplateId } from './data';

export type RitualEntry = {
  // ISO date string YYYY-MM-DD (local time). One entry per day; re-completing
  // the same day overwrites the existing record.
  date: string;
  mood: MoodId;
  template: TemplateId;
  heart?: string;
  intention?: string;
  verseRef?: string;
  completedAt: number; // ms since epoch
};

const KEY = 'prayup.journey.entries';

function read(): RitualEntry[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as RitualEntry[];
  } catch {
    return [];
  }
}

function write(entries: RitualEntry[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(entries));
    window.dispatchEvent(new Event('prayup:journey-change'));
  } catch {
    // storage quota / private mode — silently skip
  }
}

function isoDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return isoDate(new Date());
}

export function recordEntry(entry: Omit<RitualEntry, 'date' | 'completedAt'>) {
  const date = todayKey();
  const completedAt = Date.now();
  const entries = read();
  const idx = entries.findIndex((e) => e.date === date);
  const next: RitualEntry = { ...entry, date, completedAt };
  if (idx >= 0) entries[idx] = next;
  else entries.push(next);
  entries.sort((a, b) => a.date.localeCompare(b.date));
  write(entries);
}

export function getAllEntries(): RitualEntry[] {
  return read();
}

export function getEntriesByDate(): Map<string, RitualEntry> {
  const m = new Map<string, RitualEntry>();
  for (const e of read()) m.set(e.date, e);
  return m;
}

export function hasCompletedToday(): boolean {
  return getEntriesByDate().has(todayKey());
}

// Consecutive-day streak ending today (or yesterday if today not yet done).
export function getStreak(): number {
  const dates = new Set(read().map((e) => e.date));
  if (dates.size === 0) return 0;

  let streak = 0;
  const cursor = new Date();
  // If today isn't done, start counting back from yesterday so an unfinished
  // day doesn't reset the streak mid-morning.
  if (!dates.has(isoDate(cursor))) cursor.setDate(cursor.getDate() - 1);

  while (dates.has(isoDate(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

// Returns a 7-element array, Monday → Sunday, of which days *this calendar
// week* (Mon-based) have a completed ritual.
export function getThisWeek(): boolean[] {
  const dates = new Set(read().map((e) => e.date));
  const now = new Date();
  // Monday-based: shift so Mon=0, Sun=6.
  const dow = (now.getDay() + 6) % 7;
  const monday = new Date(now);
  monday.setDate(now.getDate() - dow);
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return dates.has(isoDate(d));
  });
}

export type MonthStats = {
  year: number;
  month: number; // 0-indexed (JS Date convention)
  monthLabel: string; // "May 2026"
  firstDow: number; // 0 = Sun
  daysInMonth: number;
  completed: Set<number>; // day-of-month numbers
  today: number | null; // day-of-month if "now" is in this month
};

export function getMonthStats(now: Date = new Date()): MonthStats {
  const year = now.getFullYear();
  const month = now.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const completed = new Set<number>();
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}-`;
  for (const e of read()) {
    if (e.date.startsWith(monthPrefix)) {
      completed.add(Number(e.date.slice(8, 10)));
    }
  }
  return {
    year,
    month,
    monthLabel: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    firstDow: first.getDay(),
    daysInMonth,
    completed,
    today: now.getDate(),
  };
}

export function getTotalCompleted(): number {
  return read().length;
}

export function getThisMonthCount(): number {
  const monthPrefix = todayKey().slice(0, 8);
  return read().filter((e) => e.date.startsWith(monthPrefix)).length;
}

export function getUniqueVerseCount(): number {
  const refs = new Set<string>();
  for (const e of read()) if (e.verseRef) refs.add(e.verseRef);
  return refs.size;
}

export function getRecentEntries(limit = 5): RitualEntry[] {
  return [...read()].reverse().slice(0, limit);
}

// React hook: subscribe to journey changes (same-tab via custom event +
// cross-tab via 'storage' event).
import { useEffect, useState } from 'react';

export function useJourneyVersion(): number {
  const [v, setV] = useState(0);
  useEffect(() => {
    const bump = () => setV((x) => x + 1);
    const onStorage = (e: StorageEvent) => { if (e.key === KEY) bump(); };
    window.addEventListener('prayup:journey-change', bump);
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('prayup:journey-change', bump);
      window.removeEventListener('storage', onStorage);
    };
  }, []);
  return v;
}

export function formatRelativeDate(iso: string, now: Date = new Date()): string {
  const d = new Date(iso + 'T00:00');
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return d.toLocaleDateString('en-US', { weekday: 'short' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
