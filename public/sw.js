// sw.js — Pray Up service worker
// App-shell cache + push + notificationclick. Bundle filenames are hashed,
// so we cache the navigation root and runtime-cache everything else.

const CACHE_VERSION = 'prayup-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/icons/icon-maskable.svg',
  '/icons/apple-touch.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      Promise.all(APP_SHELL.map((url) =>
        cache.add(url).catch((err) => console.warn('[SW] skipped', url, err))
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() =>
        req.mode === 'navigate' ? caches.match('/index.html') : new Response('', { status: 504 })
      );
    })
  );
});

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    if (event.data) payload = event.data.json();
  } catch {
    payload = { title: 'Pray Up', body: event.data ? event.data.text() : '' };
  }

  const title = payload.title || 'A moment to pause';
  const options = {
    body: payload.body || 'Before the scroll, a short prayer. Open Pray Up.',
    icon: payload.icon || '/icons/icon-192.svg',
    badge: payload.badge || '/icons/icon-192.svg',
    image: payload.image,
    tag: payload.tag || 'prayup-daily',
    renotify: payload.renotify ?? false,
    requireInteraction: payload.requireInteraction ?? false,
    silent: payload.silent ?? false,
    vibrate: payload.vibrate || [80, 40, 80],
    data: {
      url: payload.url || '/?action=ritual',
      verse: payload.verse,
      receivedAt: Date.now(),
    },
    actions: payload.actions || [
      { action: 'pray',  title: 'Begin prayer' },
      { action: 'later', title: 'Later' },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'later') return;
  const target = (event.notification.data && event.notification.data.url) || '/?action=ritual';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((wins) => {
      for (const w of wins) {
        if ('focus' in w) {
          w.focus();
          if ('navigate' in w) w.navigate(target);
          return;
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});

self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SAMPLE_NOTIFICATION') {
    self.registration.showNotification('A moment to pause', {
      body: event.data.body || 'Be still, and know that I am God. — Psalm 46:10',
      icon: '/icons/icon-192.svg',
      badge: '/icons/icon-192.svg',
      tag: 'prayup-sample',
      vibrate: [80, 40, 80],
      actions: [
        { action: 'pray',  title: 'Begin prayer' },
        { action: 'later', title: 'Later' },
      ],
      data: { url: '/?action=ritual' },
    });
  }
});
