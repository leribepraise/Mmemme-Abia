const base = (import.meta.env?.VITE_API_BASE_URL || '/api/v1').replace(/\/$/, '');
let access = '';
let csrf = '';
let refreshing;
const unavailable = () => new Error('The service is temporarily unavailable. Please try again shortly.');
const flatten = value => typeof value === 'string' ? value : Object.values(value || {}).map(flatten).filter(Boolean).join(' ');
export const setAccess = token => { access = token || ''; };
async function json(response) {
  if (!/application\/(?:[\w.-]+\+)?json/i.test(response.headers.get('content-type') || '')) throw unavailable();
  try { return await response.json(); } catch { throw unavailable(); }
}
async function csrfToken() {
  if (!csrf) {
    const response = await fetch(base + '/auth/csrf/', { credentials: 'include' });
    const data = await json(response);
    if (!response.ok || !data?.csrf_token) throw unavailable();
    csrf = data.csrf_token;
  }
  return csrf;
}
export async function refreshSession() {
  if (!refreshing) refreshing = (async () => {
    const response = await fetch(base + '/auth/refresh/', { method: 'POST', credentials: 'include', headers: { 'X-CSRFToken': await csrfToken() } });
    if (response.status === 401) { setAccess(''); return false; }
    const data = await json(response);
    if (!response.ok || !data?.access) throw unavailable();
    setAccess(data.access);
    return true;
  })().finally(() => { refreshing = null; });
  return refreshing;
}
export async function api(path, options = {}) {
  const { method = 'GET', body, key, retry = true, blob = false, signal } = options;
  const headers = {};
  if (access) headers.Authorization = 'Bearer ' + access;
  if (key) headers['Idempotency-Key'] = key;
  if (!['GET', 'HEAD'].includes(method)) headers['X-CSRFToken'] = await csrfToken();
  const multipart = body instanceof FormData;
  if (body !== undefined && !multipart) headers['Content-Type'] = 'application/json';
  const response = await fetch(base + path, { method, headers, credentials: 'include', signal, body: body === undefined ? undefined : multipart ? body : JSON.stringify(body) });
  if (response.status === 401 && retry && !/^\/auth\/(login|register|refresh|logout|password-reset|verify-email)/.test(path)) {
    if (await refreshSession()) return api(path, { ...options, retry: false });
  }
  if (response.status === 204) return null;
  if (blob && response.ok && !response.headers.get('content-type')?.includes('text/html')) return response.blob();
  const data = await json(response);
  if (!response.ok) throw Object.assign(new Error(flatten(data?.error || data?.detail || data) || 'Request failed.'), { status: response.status });
  if (data?.csrf_token) csrf = data.csrf_token;
  return data;
}
export async function apiPage(path, options) {
  const data = await api(path, options);
  if (!Array.isArray(data?.results)) throw unavailable();
  return data;
}
export async function allPages(path, options) {
  const rows = [];
  for (let page = 1; page <= 100; page++) {
    const data = await apiPage(`${path}${path.includes('?') ? '&' : '?'}page_size=100&page=${page}`, options);
    rows.push(...data.results);
    if (!data.next) return rows;
  }
  throw new Error('Please narrow your search.');
}
export function clearLegacyCredentials() {
  for (const storage of [sessionStorage, localStorage]) {
    for (const key of ['user', 'signupData', 'isLoggedIn', 'mmemme-auth', 'bookings', 'attendeeInfo']) storage.removeItem(key);
  }
}
export const money = value => new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(Number(value || 0));
export function downloadJSON(name, value) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = name.replace(/[^a-zA-Z0-9_.-]/g, '_') + '.json'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
