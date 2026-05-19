// bible-api.com integration. Free, no key. Caches per (reference, translation)
// in sessionStorage so a single ritual doesn't hit the API more than once per
// verse, and falls back to the hardcoded VERSE_BY_MOOD when the network is
// unreachable.

import { VERSE_BY_MOOD, type MoodId, type Verse } from './data';

const BASE = 'https://bible-api.com';
const CACHE_PREFIX = 'prayup.bible-cache.';

function cacheKey(reference: string, translation: string) {
  return `${CACHE_PREFIX}${translation}:${reference}`;
}

function readCache(reference: string, translation: string): Verse | null {
  try {
    const raw = sessionStorage.getItem(cacheKey(reference, translation));
    return raw ? JSON.parse(raw) as Verse : null;
  } catch { return null; }
}

function writeCache(reference: string, translation: string, v: Verse) {
  try { sessionStorage.setItem(cacheKey(reference, translation), JSON.stringify(v)); } catch { /* ignore */ }
}

export type FetchResult = { verse: Verse; source: 'api' | 'cache' | 'fallback' };

// Fetch the verse text for a mood. Tries bible-api.com, falls back to the
// hardcoded text if the request fails. Translation defaults to WEB (public
// domain). bible-api.com supports: web, kjv, asv, bbe, darby, ylt, dra, oeb-us.
export async function fetchVerseForMood(
  mood: MoodId,
  translation = 'web',
  signal?: AbortSignal,
): Promise<FetchResult> {
  const seed = VERSE_BY_MOOD[mood] ?? VERSE_BY_MOOD.hopeful;
  const ref = seed.ref;

  const cached = readCache(ref, translation);
  if (cached) return { verse: cached, source: 'cache' };

  try {
    const url = `${BASE}/${encodeURIComponent(ref)}?translation=${translation}`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as { text?: string; reference?: string };
    const text = (data.text ?? '').trim().replace(/\s+/g, ' ');
    if (!text) throw new Error('Empty response');
    const verse: Verse = {
      body: text,
      ref: data.reference?.trim() || ref,
      book: seed.book,
    };
    writeCache(ref, translation, verse);
    return { verse, source: 'api' };
  } catch {
    return { verse: seed, source: 'fallback' };
  }
}

import { useEffect, useState } from 'react';

export function useVerseForMood(mood: MoodId, translation = 'web'): {
  verse: Verse;
  loading: boolean;
  source: FetchResult['source'] | null;
} {
  const seed = VERSE_BY_MOOD[mood] ?? VERSE_BY_MOOD.hopeful;
  const [verse, setVerse] = useState<Verse>(() => readCache(seed.ref, translation) ?? seed);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<FetchResult['source'] | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    fetchVerseForMood(mood, translation, ac.signal).then((r) => {
      if (ac.signal.aborted) return;
      setVerse(r.verse);
      setSource(r.source);
      setLoading(false);
    });
    return () => ac.abort();
  }, [mood, translation]);

  return { verse, loading, source };
}
