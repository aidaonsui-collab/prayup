// POST /api/unsubscribe — remove a push subscription for the authed user.
// Body: { endpoint }

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

  let payload: { endpoint?: string };
  try {
    payload = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body as never);
  } catch {
    res.status(400).json({ error: 'Invalid JSON' });
    return;
  }
  if (!payload.endpoint) { res.status(400).json({ error: 'endpoint required' }); return; }

  const { error } = await adminClient
    .from('push_subscriptions')
    .delete()
    .eq('user_id', userId)
    .eq('endpoint', payload.endpoint);

  if (error) { res.status(500).json({ error: error.message }); return; }
  res.status(200).json({ ok: true });
}
