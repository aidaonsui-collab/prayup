// Client hook for the AI-personalized prayer. Caches per
// (mood, verseRef, heart, focusAreas, rewordings) so revisiting the prayer
// screen during the same ritual is free.

import { useCallback, useEffect, useRef, useState } from 'react';
import type { MoodId } from './data';

type Args = {
  mood: MoodId;
  heart: string;
  verse: { body: string; ref: string };
  focusAreas?: string[];
  enabled: boolean;
};

type State = {
  prayer: string | null;
  loading: boolean;
  error: string | null;
  source: 'ai' | 'fallback' | null;
  rewordings: number;
};

const cache = new Map<string, string>();
const cacheKey = (mood: string, ref: string, heart: string, focus: string, rewordings: number) =>
  `${mood}|${ref}|${heart}|${focus}|${rewordings}`;

export function usePersonalPrayer({ mood, heart, verse, focusAreas, enabled }: Args): State & { reword: () => void } {
  const [rewordings, setRewordings] = useState(0);
  const focusKey = (focusAreas ?? []).slice().sort().join(',');
  const [state, setState] = useState<State>({ prayer: null, loading: false, error: null, source: null, rewordings: 0 });
  const abortRef = useRef<AbortController | null>(null);

  // Reset rewording counter whenever the underlying ritual inputs change.
  useEffect(() => { setRewordings(0); }, [mood, verse.ref, heart.trim(), focusKey]);

  useEffect(() => {
    if (!enabled) {
      setState({ prayer: null, loading: false, error: null, source: null, rewordings });
      return;
    }

    const key = cacheKey(mood, verse.ref, heart.trim(), focusKey, rewordings);
    const cached = cache.get(key);
    if (cached) {
      setState({ prayer: cached, loading: false, error: null, source: 'ai', rewordings });
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setState((s) => ({ ...s, prayer: null, loading: true, error: null, source: null, rewordings }));

    fetch('/api/prayer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, heart, verse, focusAreas, rewordings }),
      signal: ac.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
          throw new Error(body.error || `HTTP ${res.status}`);
        }
        return res.json() as Promise<{ prayer: string }>;
      })
      .then((data) => {
        if (ac.signal.aborted) return;
        cache.set(key, data.prayer);
        setState({ prayer: data.prayer, loading: false, error: null, source: 'ai', rewordings });
      })
      .catch((err: Error) => {
        if (ac.signal.aborted) return;
        setState({ prayer: null, loading: false, error: err.message, source: 'fallback', rewordings });
      });

    return () => ac.abort();
  }, [mood, heart, verse.ref, focusKey, enabled, rewordings]);

  const reword = useCallback(() => setRewordings((n) => n + 1), []);
  return { ...state, reword };
}
