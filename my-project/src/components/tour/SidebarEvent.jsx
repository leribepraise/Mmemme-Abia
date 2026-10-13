import { Link } from 'react-router-dom';
import { useCollection } from '@/hooks/useApi';

const SidebarEvent = () => {
  const { data: events, loading, error } = useCollection('/events/');
  if (loading) return <div role="status" aria-label="Loading events" className="h-32 animate-pulse bg-gray-200 rounded-xl" />;
  if (error) return <p role="alert">{error.message}</p>;
  const places = events.filter(e => new Date(e.start_datetime) > new Date()).slice(0, 3);

  return (
    <div className="bg-white rounded-2xl">
      <div className="space-y-4">
        {!places.length && <p>No upcoming events yet.</p>}
        {places.map(event => (
          <Link key={event.id} to={`/events/${event.slug || event.id}`}>
            <div className="flex gap-2">
              <img src={event.image_card || event.image} alt={event.title} loading="lazy" className="w-20 h-20 rounded-md object-contain" />
              <div className="flex flex-col gap-y-2">
                <h4 className="font-semibold text-[14px] text-[#111827]">
                  {event.title}
                </h4>
                <p className="text-[12px] font-normal text-[#6B7280]">
                  {event.city}
                </p>
                <p className="text-[11px] font-normal text-[#9CA3AF]">{new Date(event.start_datetime).toLocaleDateString()}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SidebarEvent;
