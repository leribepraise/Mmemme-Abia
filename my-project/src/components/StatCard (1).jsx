import { useLocation } from 'wouter';
import { MoreHorizontal } from 'lucide-react';
import { naira, fmtDate } from '@/lib/utils';

export function EventRow({ event }) {
  const [, setLocation] = useLocation();
  return (
    <div className="event-row" data-testid={`row-event-${event.id}`}>
      <div><strong>{event.title}</strong><span style={{ display: 'block', marginTop: 3 }}>{event.venue}</span></div>
      <span>{fmtDate(event.date)}</span>
      <span>{event.ticketsSold || '—'} / {event.ticketCapacity}</span>
      <span>{event.revenue ? naira(event.revenue) : '—'}</span>
      <span className={`status status-${event.status.toLowerCase()}`}>{event.status}</span>
      <button
        className="icon-btn"
        onClick={() => setLocation(`/events/${event.id}/edit`)}
        aria-label={`Edit ${event.title}`}
        data-testid={`button-edit-event-${event.id}`}
      >
        <MoreHorizontal size={16} />
      </button>
    </div>
  );
}
