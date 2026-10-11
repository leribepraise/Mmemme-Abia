// Only public HTTPS destinations may be opened by a registration button.
export function registrationDestination(event, now = Date.now()) {
  if (event?.registration_type !== 'EXTERNAL') return null;
  if (event.status && event.status !== 'PUBLISHED') return null;
  if (event.is_suspended || !event.end_datetime || !(Date.parse(event.end_datetime) > now)) return null;
  const value = event.registration_url || '';
  if (!/^https:\/\//i.test(value) || /[\s\\]/.test(value)) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return null;
    return { href: url.href, host: url.hostname };
  } catch { return null; }
}
