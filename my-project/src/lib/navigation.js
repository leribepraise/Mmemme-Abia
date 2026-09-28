export function safeAppPath(value, fallback = '/notifications') {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\\\s\x00-\x1f]/.test(value)) return fallback;
  return value;
}
export const eventTicketPath = event => event?.id ? `/events/${encodeURIComponent(event.id)}` : '/events';
