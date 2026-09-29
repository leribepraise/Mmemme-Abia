import { FiCalendar, FiMapPin } from "react-icons/fi";

const EventHighlights = ({ event }) => {
  return (
    <div className="md:col-span-5 space-y-4">
      <h1 className="text-[40px] font-bold">{event?.text || "Event"}</h1>

      <div className="space-y-3 text-sm">
        <div className="flex gap-3">
          <FiCalendar />

          <div>
            <p>{new Date(event.start_datetime).toLocaleDateString()}</p>
            <p>{event.time}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <FiMapPin />

          <div>
            <p>{event?.text2 || "Location unavailable"}</p>

            <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.address || event.venue)}`, "_blank", "noopener,noreferrer")} className="text-green-700 text-sm">View on map</button>
          </div>
        </div>
      </div>

      {/* organizer */}

      <div className="border-t pt-3 flex items-center gap-3">
        {event.organizer?.logo ? <img src={event.organizer.logo} alt={`${event.organizer.name} logo`} className="h-10 w-10 rounded-lg object-contain" /> : <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EAF5EA] font-bold text-[#3F7D3D]">{event.organizer?.name?.charAt(0) || 'M'}</span>}

        <div>
          <p className="text-xs">Organized By</p>

          <h3 className="font-semibold">{event.organizer?.name}</h3>
        </div>
      </div>

      <p className="text-lg">{event.description}</p>
    </div>
  );
};

export default EventHighlights;
