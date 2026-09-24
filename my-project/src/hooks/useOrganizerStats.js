import { useCollection } from './useApi';
import { organizerEvent } from '@/lib/catalog';
import { organizerStats } from '@/lib/organizerStats';
export function useOrganizerStats() {
  const events = useCollection('/events/mine/', organizerEvent);
  const bookings = useCollection('/bookings/received/');
  return { ...organizerStats(events.data, bookings.data), loading: events.loading || bookings.loading, error: events.error || bookings.error };
}
