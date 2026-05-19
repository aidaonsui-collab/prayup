# Pray Up

A daily sacred pause. **Pause. Pray. Proceed with clarity.**

A mobile-first PWA for a brief spiritual ritual: heart check-in → Scripture
of the day → a personalized AI prayer (or one of four classical postures) →
a 2-minute reflection space with a breathing orb → setting one clear
intention → a quiet completion screen with optional reflection.

## Features

- **7-step ritual flow** — Welcome → Heart check-in → Scripture → Prayer →
  Reflection space (breathing orb + 2-min timer) → Intention → Complete
- **AI-personalized prayer** via MiniMax M2.7, anchored to the verse and
  shaped by the user's mood, heart note, and focus areas. "Try another
  wording" re-fires the model with higher temperature. Graceful fallback
  to pre-written prayers if the API key isn't configured.
- **Real Scripture** pulled from [bible-api.com](https://bible-api.com)
  (WEB translation, public domain), cached per session.
- **Real streak + history** — every ritual records a `ritual_entry` and
  the streak/calendar/insights derive from those entries. No fake numbers.
- **Saved prayers** — heart the ones that resonate, browse them in Settings.
- **Cross-device sync** via Supabase + magic-link email auth (optional —
  the app works fully offline on a single device too).
- **Daily push reminders** via web push + Vercel Cron. Honors each user's
  IANA timezone so 7:00 AM means 7:00 AM their time.
- **Installable PWA** — manifest, service worker, four SVG icons.

## Stack

- Vite · React 18 · TypeScript · React Router v6
- `@supabase/supabase-js` for auth + sync + push subscription store
- `web-push` for VAPID-signed notifications
- MiniMax M2.7 for prayer generation
- Vercel serverless routes (`api/*.ts`) + Vercel Cron for daily delivery

## Local development

```bash
npm install
cp .env.example .env.local        # then fill in keys you want to use locally
npm run dev                       # http://localhost:5173
npm run build && npm run preview
```

A Vite middleware proxies `/api/*` to the same handler files Vercel uses,
so endpoints work identically in `npm run dev` and on the deployed site.

## Deployment (Vercel)

The repo deploys cleanly to Vercel — no extra config files required beyond
the included `vercel.json`. Set these env vars in **Vercel → Project →
Settings → Environment Variables**:

| Variable | Used by | Notes |
|---|---|---|
| `MINIMAX_API_KEY` | `/api/prayer` | Get one at [platform.minimax.io](https://platform.minimax.io). ~$0.0004 per prayer. |
| `VITE_SUPABASE_URL` | Client | `https://boatyhrefcilcxepnbbf.supabase.co` (shared with Bylined; tables live in the `prayup` schema). |
| `VITE_SUPABASE_ANON_KEY` | Client | Publishable key, safe in the browser. |
| `SUPABASE_URL` | Server | Same as the VITE one. |
| `SUPABASE_ANON_KEY` | Server | Used to verify user JWTs. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server | Bypasses RLS. **Never expose to the browser.** |
| `VITE_VAPID_PUBLIC_KEY` | Client | Public half of the VAPID pair. |
| `VAPID_PUBLIC_KEY` | Server | Same value, used by `web-push` server-side. |
| `VAPID_PRIVATE_KEY` | Server | Private half. Never expose. |
| `VAPID_SUBJECT` | Server | `mailto:hello@your-domain.com` |
| `CRON_SECRET` | Server | A long random string. Vercel Cron sets `x-vercel-cron` so this is just for manual invocations. |

Generate fresh VAPID keys with `npx web-push generate-vapid-keys --json`.

`vercel.json` schedules `/api/send-reminders` every 5 minutes. The endpoint
checks each push subscription's `reminder_time` against the user's local
time (via stored IANA tz) and dispatches if within ±3 minutes and not
already sent today.

## Database schema

Lives in the `prayup` schema on the shared Bylined Supabase project.
Tables (all RLS-scoped to `auth.uid()`):

- `prayup.profiles` — display name, focus areas, carrying, reminder prefs
- `prayup.ritual_entries` — one row per completed ritual day per user
- `prayup.saved_prayers` — favorited generated prayers
- `prayup.push_subscriptions` — endpoint + keys + reminder_time + tz

The Supabase JS client is initialized with `db: { schema: 'prayup' }` so
every `.from('<table>')` call targets the right schema automatically.

## Layout

```
api/                          Vercel serverless functions
├─ prayer.ts                  POST — MiniMax M2.7 prayer generation
├─ subscribe.ts               POST — persist a push subscription (authed)
├─ unsubscribe.ts             POST — remove a push subscription (authed)
├─ send-reminders.ts          GET — cron-triggered daily reminder dispatch
└─ _lib/
   ├─ prayer-handler.ts       shared MiniMax call (also used in Vite dev)
   └─ supabase-admin.ts       service-role client + JWT verification

src/
├─ App.tsx                    routes + ritual context + AuthProvider + sync
├─ main.tsx                   entry; registers service worker
├─ lib/
│  ├─ data.ts                 moods, verses, prayer templates, intentions
│  ├─ state.ts                useLocalState hook
│  ├─ profile.ts              user profile + saved prayers (localStorage)
│  ├─ journey.ts              streak / history / insights derived from entries
│  ├─ bible.ts                bible-api.com fetch + session cache
│  ├─ usePersonalPrayer.ts    AI prayer hook with reword + cache
│  ├─ supabase.ts             client (prayup schema)
│  ├─ auth.tsx                AuthProvider + useAuth (magic link)
│  ├─ sync.ts                 two-way sync between localStorage and DB
│  └─ pwa.ts                  install + push subscription helpers
├─ components/                Icon, Wordmark, BreathingOrb, LightRays, …
└─ screens/
   ├─ Landing.tsx · Onboard.tsx · Home.tsx · Dashboard.tsx · Settings.tsx
   └─ ritual/
      ├─ Welcome → Checkin → Scripture → Prayer → Space → Intention → Complete
      ├─ RitualShell.tsx      shared step chrome
      └─ state.tsx            ritual context
```

## Design

Originally mocked up in Claude Design (claude.ai/design) and ported here.
Tokens: midnight navy `#0F172A`, warm gold `#C9A227`, cream `#F7F1E5`.
Fonts: Inter (UI) + EB Garamond / Fraunces (scripture & headings).
