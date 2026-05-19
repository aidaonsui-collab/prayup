// PWA + Web Push helpers. Exposes a small subscribable state machine
// for the Settings panel.

export type PWAState = {
  isSecure: boolean;
  supportsSW: boolean;
  supportsPush: boolean;
  supportsNotif: boolean;
  permission: NotificationPermission | 'unsupported';
  registered: boolean;
  subscribed: boolean;
  installable: boolean;
  standalone: boolean;
};

const isSecure = location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1';
const supportsSW = 'serviceWorker' in navigator;
const supportsPush = 'PushManager' in window;
const supportsNotif = 'Notification' in window;

const VAPID_PUBLIC_KEY = 'BNQc3jR8YXKQ8mNbXkV9k5_3GxJ9LXf6X7zJ7eW8Q9j5_3WfYn7B8c9pQ2-DEMOKEY';

let swReg: ServiceWorkerRegistration | null = null;
let currentSub: PushSubscription | null = null;
let deferredInstall: BeforeInstallPromptEvent | null = null;
const listeners = new Set<(s: PWAState) => void>();

function state(): PWAState {
  type SafariNav = Navigator & { standalone?: boolean };
  return {
    isSecure, supportsSW, supportsPush, supportsNotif,
    permission: supportsNotif ? Notification.permission : 'unsupported',
    registered: !!swReg,
    subscribed: !!currentSub,
    installable: !!deferredInstall,
    standalone: window.matchMedia('(display-mode: standalone)').matches
      || (window.navigator as SafariNav).standalone === true,
  };
}

function emit() {
  const s = state();
  for (const fn of listeners) fn(s);
}

export function subscribe(fn: (s: PWAState) => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

// Window-level type augmentation for the install prompt event.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
};

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstall = e as BeforeInstallPromptEvent;
  emit();
});
window.addEventListener('appinstalled', () => {
  deferredInstall = null;
  emit();
});

export async function register() {
  if (!supportsSW) return null;
  try {
    swReg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
    swReg.addEventListener('updatefound', emit);
    if (supportsPush) {
      try {
        currentSub = await swReg.pushManager.getSubscription();
      } catch { /* push API may throw on incognito */ }
    }
    emit();
    return swReg;
  } catch (err) {
    console.warn('[PrayUp PWA] SW registration failed', err);
    return null;
  }
}

export async function promptInstall() {
  if (!deferredInstall) return { outcome: 'unavailable' as const };
  await deferredInstall.prompt();
  const choice = await deferredInstall.userChoice;
  deferredInstall = null;
  emit();
  return choice;
}

export async function requestPermission(): Promise<NotificationPermission | 'unsupported' | 'error'> {
  if (!supportsNotif) return 'unsupported';
  try {
    const perm = await Notification.requestPermission();
    emit();
    return perm;
  } catch {
    return 'error';
  }
}

function urlBase64ToUint8Array(base64: string) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(b64);
  const out = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}

export async function subscribePush() {
  if (!swReg || !supportsPush) return null;
  if (Notification.permission !== 'granted') {
    const perm = await requestPermission();
    if (perm !== 'granted') return null;
  }
  try {
    const sub = await swReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    currentSub = sub;
    console.info('[PrayUp PWA] push subscription:', sub.toJSON());
    emit();
    return sub;
  } catch (err) {
    console.warn('[PrayUp PWA] subscribe failed', err);
    return null;
  }
}

export async function unsubscribePush() {
  if (!swReg) return false;
  const sub = await swReg.pushManager.getSubscription();
  if (!sub) return false;
  const ok = await sub.unsubscribe();
  currentSub = null;
  emit();
  return ok;
}

export async function sendSampleNotification(body?: string) {
  if (!supportsNotif) {
    alert('Notifications are not supported in this browser.');
    return;
  }
  if (Notification.permission !== 'granted') {
    const perm = await requestPermission();
    if (perm !== 'granted') return;
  }
  const text = body || 'Be still, and know that I am God. — Psalm 46:10';
  if (swReg && swReg.active) {
    swReg.active.postMessage({ type: 'SAMPLE_NOTIFICATION', body: text });
  } else if (swReg && swReg.showNotification) {
    swReg.showNotification('A moment to pause', {
      body: text, icon: '/icons/icon-192.svg', tag: 'prayup-sample',
      data: { url: '/?action=ritual' },
    });
  } else {
    new Notification('A moment to pause', { body: text, icon: '/icons/icon-192.svg' });
  }
}

export const PrayUpPWA = {
  state,
  subscribe,
  register,
  promptInstall,
  requestPermission,
  subscribePush,
  unsubscribePush,
  sendSampleNotification,
};

if (supportsSW && isSecure) {
  window.addEventListener('load', register);
} else if (!isSecure) {
  console.info('[PrayUp PWA] Skipping service-worker registration on non-secure origin. PWA features activate once deployed over HTTPS.');
}
