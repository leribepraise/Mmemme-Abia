import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Heart, MapPin } from "lucide-react";

const EventCard = ({ event }) => {
  const [isSaved, setIsSaved] = useState(false);

  // Check if this event is already saved
  useEffect(() => {
    const savedEvents = JSON.parse(
      sessionStorage.getItem("savedEvents") || "[]",
    );

    const alreadySaved = savedEvents.some(
      (savedEvent) => savedEvent.id === event.id,
    );

    setIsSaved(alreadySaved);
  }, [event.id]);

  const handleSave = (e) => {
    // Prevent the heart button from opening the event
    e.preventDefault();
    e.stopPropagation();

    const savedEvents = JSON.parse(
      sessionStorage.getItem("savedEvents") || "[]",
    );

    if (isSaved) {
      // Remove event from saved events
      const updatedEvents = savedEvents.filter(
        (savedEvent) => savedEvent.id !== event.id,
      );

      sessionStorage.setItem("savedEvents", JSON.stringify(updatedEvents));

      setIsSaved(false);

      // Tell SavedItems that something changed
      window.dispatchEvent(new Event("savedEventsUpdated"));
    } else {
      // Add event to saved events
      const updatedEvents = [...savedEvents, event];

      sessionStorage.setItem("savedEvents", JSON.stringify(updatedEvents));

      setIsSaved(true);

      // Tell SavedItems that something changed
      window.dispatchEvent(new Event("savedEventsUpdated"));
    }
  };

  return (
    <div className="block">
      <div className="w-[313px] overflow-hidden rounded-2xl border border-gray-100 bg-[#FEFEFE] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
        {/* Image & Overlays */}
        <div className="relative h-[150px] w-full">
          <NavLink to={`/events/${event.id}`} className="block h-full">
            <img
              src={event.image}
              alt={event.text}
              className="h-full w-full object-cover"
            />
          </NavLink>

          {/* Date Badge */}
          <div className="absolute left-3 top-3 rounded-xl bg-[#FF6A00] px-2.5 py-1 text-center text-white shadow-sm">
            <span className="block text-sm font-bold leading-tight">
              {event.dateDay || "28"}
            </span>

            <span className="block text-[10px] font-semibold uppercase tracking-wider">
              {event.dateMonth || "OCT"}
            </span>
          </div>

          {/* Heart Button */}
          <button
            type="button"
            onClick={handleSave}
            aria-label={isSaved ? "Remove from saved" : "Save event"}
            className={`absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-md transition-all hover:bg-white ${
              isSaved ? "text-red-500" : "text-gray-700 hover:text-red-500"
            }`}
          >
            <Heart
              className="h-4 w-4"
              fill={isSaved ? "currentColor" : "none"}
            />
          </button>
        </div>

        {/* Content Section */}
        <NavLink to={`/events/${event.id}`} className="block">
          <div className="flex flex-grow flex-col justify-between space-y-3 p-3.5">
            <p className="truncate text-[15px] font-semibold text-gray-900">
              {event.text}
            </p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex min-w-0 items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5 shrink-0" />

                <span className="truncate">{event.text2}</span>
              </div>

              <p className="text-[15px] font-semibold text-[#3C6E16]">
                {event.text3}
              </p>
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  );
};

export default EventCard;
