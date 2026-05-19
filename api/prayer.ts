// Vercel serverless function: POST /api/prayer
// Generates a short personalized prayer via MiniMax M2.7.

import { generatePrayer, type PrayerRequest } from './_lib/prayer-handler';

export const config = { runtime: 'nodejs' };

type VercelRequest = {
  method?: string;
  body?: PrayerRequest | string;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  setHeader: (key: string, value: string) => void;
  json: (body: unknown) => void;
  end: () => void;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'POST only' });
    return;
  }

  let payload: PrayerRequest;
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {} as PrayerRequest);
  } catch {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

  if (!payload.mood) {
    res.status(400).json({ error: 'mood is required' });
    return;
  }

  const result = await generatePrayer(payload);

  if (result.source === 'fallback') {
    res.status(502).json({ error: result.error || 'Generation failed' });
    return;
  }

  res.status(200).json({ prayer: result.prayer, source: result.source });
}
