import { safeAppPath } from './navigation.js';

const RETURN_KEY = 'mmemme-auth-return';
const RETURN_TTL = 24 * 60 * 60 * 1000;
const browserStorage = () => {
  try { return globalThis.sessionStorage; } catch { return null; }
};

// Destinations stay inside the app and cannot send people back into an auth loop.
export function safeAuthReturn(value) {
  const path = safeAppPath(value, '');
  if (!path || path.length > 2048) return '';
  let decoded = path;
  try {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      decoded = decodeURIComponent(decoded);
      if (!safeAppPath(decoded, '')) return '';
    }
    const url = new URL(decoded, 'https://mmemme.invalid');
    if (url.origin !== 'https://mmemme.invalid') return '';
    if (/^\/(?:api|auth|login|signup|sign-up|verify-email|reset-password|share)(?:\/|$)/i.test(url.pathname)) return '';
    return path;
  } catch { return ''; }
}

export function readAuthReturn(storage = browserStorage(), now = Date.now()) {
  try {
    const saved = JSON.parse(storage?.getItem(RETURN_KEY) || 'null');
    if (!saved || !Number.isFinite(saved.savedAt) || now - saved.savedAt > RETURN_TTL || saved.savedAt > now) return '';
    return safeAuthReturn(saved.path);
  } catch { return ''; }
}

export function rememberAuthReturn(value, storage = browserStorage(), now = Date.now()) {
  const path = safeAuthReturn(value);
  if (path) {
    try { storage?.setItem(RETURN_KEY, JSON.stringify({ path, savedAt: now })); }
    catch { /* Query parameters still preserve the destination when storage is blocked. */ }
  }
  return path;
}

export function clearAuthReturn(storage = browserStorage()) {
  try { storage?.removeItem(RETURN_KEY); } catch { /* Private browsing may block storage. */ }
}

export function authReturnFrom(location, storage = browserStorage()) {
  return safeAuthReturn(new URLSearchParams(location?.search || '').get('next'))
    || safeAuthReturn(location?.state?.from)
    || readAuthReturn(storage);
}

export function authPagePath(path, returnTo) {
  const next = safeAuthReturn(returnTo);
  return next ? `${path}?next=${encodeURIComponent(next)}` : path;
}

export function postAuthPath(user, returnTo, organizer = false) {
  return safeAuthReturn(returnTo) || (organizer
    ? user?.role === 'ORGANIZER' && user?.is_verified ? '/organizer/dashboard' : '/organizer/apply'
    : user?.onboarding_completed_at ? '/dashboard' : '/Signup/onboarding');
}

export function sharedEventPath(event) {
  const slug = typeof event === 'object' && event ? event.share_slug || event.slug || event.id : event;
  return /^[a-zA-Z0-9_-]+$/.test(String(slug || '')) ? `/share/events/${encodeURIComponent(slug)}` : '/events';
}
