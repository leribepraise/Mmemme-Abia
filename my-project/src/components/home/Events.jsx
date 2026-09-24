import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPublicEvents } from "../../data/eventData";

const Events = () => {
  const navigate = useNavigate();

  // Same live-events pattern as the main Events page: read published
  // organizer events on mount, then refresh whenever one is published
  // (or another tab changes localStorage), so a new event shows up here
  // without a full page reload.
  const [events, setEvents] = useState(() => getPublicEvents());

  useEffect(() => {
    const refresh = () => setEvents(getPublicEvents());
    window.addEventListener("mmemme-events-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("mmemme-events-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  if (events.length === 0) return null;

  const renderCard = (event, keyPrefix) => (
    <div
      key={`${keyPrefix}-${event.id}`}
      onClick={() => navigate(`/events/${event.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/events/${event.id}`)}
      className="w-[313px] h-[240px] rounded-3xl bg-[#FEFEFE] transition duration-300 hover:bg-[#F1FCEE] hover:text-black hover:-translate-y-1 hover:shadow-md cursor-pointer shrink-0"
    >
      <img src={event.image} className="w-full h-[140px] object-cover rounded-t-3xl" alt={event.text} />
      <div className="p-3 space-y-3">
        <p className="font-semibold text-[16px] truncate">{event.text}</p>
        <div className="flex justify-between">
          <p className="font-medium text-[12px]">{event.text2}</p>
          <p className="font-semibold text-[16px] text-[#3C6E16]">{event.text3}</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="mt-10 overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-semibold text-left mb-5">
            Trending Events 🔥
          </h1>
          <div>
            <p
              onClick={() => navigate("/events")}
              className="font-semibold text-[12px] text-[#F46F1A] cursor-pointer hover:underline"
            >
              See More
            </p>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex justify-between items-center w-max animate-marquees">
            <div className="flex w-max gap-10 md:gap-5">
              {events.map((event) => renderCard(event, "first"))}
            </div>

            {/* Duplicate set: keeps the marquee looping seamlessly. Real
                content now comes from the same source as the main Events
                page, so this list grows automatically as organizers
                publish new events. */}
            <div className="flex gap-5">
              {events.map((event) => renderCard(event, "dup"))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Events;
