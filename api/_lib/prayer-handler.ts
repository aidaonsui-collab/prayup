// Shared MiniMax-backed prayer handler.
// Used by api/prayer.ts (Vercel serverless) and the Vite dev middleware.

import { MOODS, VERSE_BY_MOOD, type MoodId } from '../../src/lib/data';

type PrayerRequest = {
  mood: MoodId;
  heart?: string;
  verse?: { body: string; ref: string };
};

const MINIMAX_BASE_URL = process.env.MINIMAX_BASE_URL || 'https://api.minimaxi.chat/v1';
const MINIMAX_MODEL = process.env.MINIMAX_MODEL || 'MiniMax-M2.7';

function buildSystemPrompt(): string {
  return [
    'You are writing a short, intimate Christian prayer for a user pausing for a daily ritual.',
    'Write in the second person, as if the user themselves is praying it aloud — address God directly ("Father, …").',
    'Tone: serene, reverent, hopeful, never preachy. Modern English, no King James archaisms.',
    'Length: 90–160 words. No headings. No bullet points. No quotation marks around the prayer.',
    'Anchor the prayer in the verse the user received today — echo its theme without quoting it verbatim.',
    'If the user shared what is on their heart, weave it in gently and specifically. If they shared nothing, do not invent specifics; stay on the mood.',
    'End with "Amen." on its own — no other closing.',
  ].join(' ');
}

function buildUserPrompt(req: PrayerRequest): string {
  const mood = MOODS.find((m) => m.id === req.mood) ?? MOODS[0];
  const verse = req.verse ?? VERSE_BY_MOOD[req.mood] ?? VERSE_BY_MOOD.hopeful;
  const heartLine = req.heart && req.heart.trim()
    ? `What is on my heart today: ${req.heart.trim()}`
    : 'I have not written anything specific today.';

  return [
    `My heart today: ${mood.label.toLowerCase()} — ${mood.sub.toLowerCase()}.`,
    `The verse I received: "${verse.body}" — ${verse.ref}.`,
    heartLine,
    'Please write the prayer for me.',
  ].join('\n');
}

export async function generatePrayer(req: PrayerRequest): Promise<{ prayer: string; source: 'minimax' | 'fallback'; error?: string }> {
  const apiKey = process.env.MINIMAX_API_KEY;
  if (!apiKey) {
    return { prayer: '', source: 'fallback', error: 'MINIMAX_API_KEY not configured' };
  }

  try {
    const res = await fetch(`${MINIMAX_BASE_URL}/text/chatcompletion_v2`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MINIMAX_MODEL,
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          { role: 'user', content: buildUserPrompt(req) },
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { prayer: '', source: 'fallback', error: `MiniMax HTTP ${res.status}: ${body.slice(0, 200)}` };
    }

    const data = await res.json() as {
      choices?: { message?: { content?: string } }[];
      base_resp?: { status_code?: number; status_msg?: string };
    };

    if (data.base_resp && data.base_resp.status_code && data.base_resp.status_code !== 0) {
      return { prayer: '', source: 'fallback', error: `MiniMax: ${data.base_resp.status_msg}` };
    }

    const text = data.choices?.[0]?.message?.content?.trim() ?? '';
    if (!text) return { prayer: '', source: 'fallback', error: 'MiniMax returned empty content' };

    return { prayer: text, source: 'minimax' };
  } catch (err) {
    return { prayer: '', source: 'fallback', error: (err as Error).message };
  }
}

export type { PrayerRequest };
