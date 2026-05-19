# Pray Up

A daily sacred pause. **Pause. Pray. Proceed with clarity.**

A mobile-first web app for a brief spiritual ritual: heart check-in → Scripture
of the day → a personalized prayer (or one of four classical postures) → a
2-minute reflection space with a breathing orb → setting one clear intention →
a quiet completion screen.

## Stack

- Vite · React 18 · TypeScript
- React Router v6 (one route per ritual step, deep-linkable)
- `localStorage` for ritual state (mood, heart note, prayer template, intention)
- PWA: manifest, service worker (offline shell + push), four SVG icons

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

## Layout

```
src/
├─ App.tsx                 routes + ritual context
├─ main.tsx                entry; registers service worker
├─ lib/
│  ├─ data.ts              moods, verses, prayer templates, intentions
│  ├─ state.ts             useLocalState hook
│  └─ pwa.ts               PrayUpPWA helpers (register, push, install)
├─ components/             shared UI (Icon, Wordmark, BreathingOrb, …)
└─ screens/
   ├─ Landing.tsx · Onboard.tsx · Home.tsx · Dashboard.tsx · Settings.tsx
   └─ ritual/
      ├─ Welcome → Checkin → Scripture → Prayer → Space → Intention → Complete
      ├─ RitualShell.tsx   shared step chrome (back / progress / close)
      └─ state.tsx         ritual context
```

## Design

Originally mocked up in Claude Design (claude.ai/design) and ported here.
Tokens: midnight navy `#0F172A`, warm gold `#C9A227`, cream `#F7F1E5`.
Fonts: Inter (UI) + EB Garamond / Fraunces (scripture & headings).

## PWA notes

The service worker auto-registers on `https://` and `localhost`. Push
notifications need a VAPID key — replace `VAPID_PUBLIC_KEY` in
[src/lib/pwa.ts](src/lib/pwa.ts) and POST the subscription to your server.
