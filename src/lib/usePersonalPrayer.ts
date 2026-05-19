// Client hook for the AI-personalized prayer. Caches per (mood, verseRef,
// heart) so revisiting the prayer screen during the same ritual is free.

import { useEffect, useRef, useState } from 'react';
import type { MoodId } from './data';

type Args = {
  mood: MoodId;
  heart: string;
  verse: { body: string; ref: string };
  enabled: boolean; // only fire when template === 'personal'
};

type State = {
  prayer: string | null;
  loading: boolean;
  error: string | null;
  source: 'ai' | 'fallback' | null;
};

const cache = new Map<string, string>();
const cacheKey = (a: Pick<Args, 'mood' | 'heart' | 'verse'>) =>
  `${a.mood}|${a.verse.ref}|${a.heart.trim()}`;

export function usePersonalPrayer({ mood, heart, verse, enabled }: Args): State {
  const [state, setState] = useState<State>({ prayer: null, loading: false, error: null, source: null });
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!enabled) {
      setState({ prayer: null, loading: false, error: null, source: null });
      return;
    }

    const key = cacheKey({ mood, heart, verse });
    const cached = cache.get(key);
    if (cached) {
      setState({ prayer: cached, loading: false, error: null, source: 'ai' });
      return;
    }

    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    setState({ prayer: null, loading: true, error: null, source: null });

    fetch('/api/prayer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mood, heart, verse }),
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
        setState({ prayer: data.prayer, loading: false, error: null, source: 'ai' });
      })
      .catch((err: Error) => {
        if (ac.signal.aborted) return;
        setState({ prayer: null, loading: false, error: err.message, source: 'fallback' });
      });

    return () => ac.abort();
  }, [mood, heart, verse.ref, enabled]);

  return state;
}
