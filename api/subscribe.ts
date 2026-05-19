// POST /api/subscribe — persist a push subscription for the authed user.
// Body: { subscription, reminder_time?, tz?, user_agent? }
// Header: Authorization: Bearer <supabase access token>

import { adminClient, getUserFromToken } from './_lib/supabase-admin.js';

export const config = { runtime: 'nodejs' };

type VercelReq = {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body?: unknown;
};
type VercelRes = {
  status: (n: number) => VercelRes;
  setHeader: (k: string, v: string) => void;
  json: (b: unknown) => void;
  end: () => void;
};

function bearer(req: VercelReq): string | undefined {
  const h = req.headers.authorization;
  const raw = Array.isArray(h) ? h[0] : h;
  if (!raw || !raw.startsWith('Bearer ')) return undefined;
  return raw.slice(7);
}

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  if (!adminClient) { res.status(500).json({ error: 'Server not configured' }); return; }

  const userId = await getUserFromToken(bearer(req));
  if (!userId) { res.status(401).json({ error: 'Unauthorized' }); return; }

  let payload: {
    subscription: { endpoint: string; keys: { p256dh: string; auth: string } };
    reminder_time?: string;
    tz?: string;
    user_agent?: string;
  };
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as never);
  } catch {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }

  const sub = payload?.subscription;
  if (!sub?.endpoint || !sub.keys?.p256dh || !sub.keys?.auth) {
    res.status(400).json({ error: 'Invalid subscription' });
    return;
  }

  const { error } = await adminClient.from('push_subscriptions').upsert({
    user_id: userId,
    endpoint: sub.endpoint,
    p256dh: sub.keys.p256dh,
    auth: sub.keys.auth,
    reminder_time: payload.reminder_time || null,
    tz: payload.tz || null,
    user_agent: payload.user_agent || null,
  }, { onConflict: 'user_id,endpoint' });

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(200).json({ ok: true });
}
