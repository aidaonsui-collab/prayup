// GET /api/send-reminders — Vercel Cron hits this every 5 minutes.
// For each push_subscription whose (tz, reminder_time) maps to "now" in their
// local timezone (within a 5-minute window), send a web-push notification.
// Protected by ?secret=$CRON_SECRET (or x-cron-secret header).

import webpush from 'web-push';
import { adminClient } from './_lib/supabase-admin.js';

export const config = { runtime: 'nodejs' };

type VercelReq = {
  method?: string;
  url?: string;
  headers: Record<string, string | string[] | undefined>;
};
type VercelRes = {
  status: (n: number) => VercelRes;
  setHeader: (k: string, v: string) => void;
  json: (b: unknown) => void;
  end: () => void;
};

const VERSES = [
  '"Be still, and know that I am God." — Psalm 46:10',
  '"This is the day that the Lord has made." — Psalm 118:24',
  '"Come to me, all who are weary." — Matthew 11:28',
  '"Cast all your anxiety on him because he cares for you." — 1 Peter 5:7',
  '"The Lord is my shepherd; I shall not want." — Psalm 23:1',
  '"Do not be anxious about anything." — Philippians 4:6',
  '"Trust in the Lord with all your heart." — Proverbs 3:5',
];

function configureWebPush(): boolean {
  const pub = process.env.VAPID_PUBLIC_KEY;
  const priv = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:hello@prayup.app';
  if (!pub || !priv) return false;
  webpush.setVapidDetails(subject, pub, priv);
  return true;
}

// "HH:MM" 24h of `now` in IANA tz. Falls back to UTC if tz is invalid.
function localHHMM(now: Date, tz: string): string {
  try {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const parts = fmt.formatToParts(now);
    const h = parts.find((p) => p.type === 'hour')?.value ?? '00';
    const m = parts.find((p) => p.type === 'minute')?.value ?? '00';
    return `${h}:${m}`;
  } catch {
    return now.toISOString().slice(11, 16);
  }
}

// True if `target` (HH:MM) is within ±windowMins of `now` (HH:MM) in the same day.
function withinWindow(nowHHMM: string, target: string, windowMins: number): boolean {
  const toMin = (s: string) => {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + m;
  };
  return Math.abs(toMin(nowHHMM) - toMin(target)) < windowMins;
}

type SubRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  reminder_time: string | null;
  tz: string | null;
  last_sent_at: string | null;
};

export default async function handler(req: VercelReq, res: VercelRes) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET' && req.method !== 'POST') { res.status(405).json({ error: 'GET or POST only' }); return; }

  // Auth: ?secret= or x-cron-secret header. Vercel Cron sends x-vercel-cron.
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const url = new URL(req.url ?? '/api/send-reminders', 'http://x');
    const querySecret = url.searchParams.get('secret');
    const headerSecret = Array.isArray(req.headers['x-cron-secret']) ? req.headers['x-cron-secret'][0] : req.headers['x-cron-secret'];
    const fromVercelCron = !!req.headers['x-vercel-cron'];
    if (!fromVercelCron && querySecret !== cronSecret && headerSecret !== cronSecret) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  }

  if (!adminClient) { res.status(500).json({ error: 'Server not configured (Supabase)' }); return; }
  if (!configureWebPush()) { res.status(500).json({ error: 'Server not configured (VAPID)' }); return; }

  const now = new Date();
  const todayIso = now.toISOString().slice(0, 10);

  const { data: rows, error } = await adminClient
    .from('push_subscriptions')
    .select('id, user_id, endpoint, p256dh, auth, reminder_time, tz, last_sent_at')
    .not('reminder_time', 'is', null);

  if (error) { res.status(500).json({ error: error.message }); return; }
  const candidates = (rows ?? []) as SubRow[];

  let sent = 0;
  let skipped = 0;
  let removed = 0;

  for (const row of candidates) {
    const tz = row.tz || 'UTC';
    const target = row.reminder_time as string;
    const nowHHMM = localHHMM(now, tz);
    if (!withinWindow(nowHHMM, target, 3)) { skipped += 1; continue; }
    // Already sent today? Compare last_sent_at to today in their tz.
    if (row.last_sent_at) {
      const sentLocal = localHHMM(new Date(row.last_sent_at), tz);
      void sentLocal;
      const sentDate = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(new Date(row.last_sent_at));
      const todayLocal = new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' })
        .format(now);
      if (sentDate === todayLocal) { skipped += 1; continue; }
    }

    const verse = VERSES[Math.floor(Math.random() * VERSES.length)];
    const payload = JSON.stringify({
      title: 'A sacred pause',
      body: verse,
      url: '/?action=ritual',
      tag: `prayup-daily-${todayIso}`,
    });

    try {
      await webpush.sendNotification(
        { endpoint: row.endpoint, keys: { p256dh: row.p256dh, auth: row.auth } },
        payload,
      );
      await adminClient.from('push_subscriptions').update({ last_sent_at: now.toISOString() }).eq('id', row.id);
      sent += 1;
    } catch (err: unknown) {
      const status = (err as { statusCode?: number })?.statusCode;
      // 404/410 = subscription gone; clean it up.
      if (status === 404 || status === 410) {
        await adminClient.from('push_subscriptions').delete().eq('id', row.id);
        removed += 1;
      } else {
        skipped += 1;
      }
    }
  }

  res.status(200).json({ checked: candidates.length, sent, skipped, removed });
}
