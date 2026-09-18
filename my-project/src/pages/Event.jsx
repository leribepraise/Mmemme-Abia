import React, { useEffect, useState } from "react";
import FilterSidebar from "../components/events/FilterSidebar";
import EventsTopBar from "../components/events/EventsTopBar";
import EventGrid from "../components/events/EventGrid";
import Pagination from "../components/events/Pagination";
import Updateed from "../components/home/Updateed";
import Patners from "../components/home/Patners";
import { getPublicEvents } from "../data/eventData";

const Events = () => {
  const [slider, setSlider] = useState(0);
  const [events, setEvents] = useState(() => getPublicEvents());

  useEffect(() => {
    const refreshEvents = () => setEvents(getPublicEvents());
    window.addEventListener("mmemme-events-updated", refreshEvents);
    return () => window.removeEventListener("mmemme-events-updated", refreshEvents);
  }, []);

  return (
    /* Added pt-24 (or pt-28) to push content down below the fixed navbar */
    <div className="min-h-screen bg-[#f5f7f3] px-4 pt-24 pb-5 md:px-6">
      <div className="mb-4">
        <h1 className="text-[25px] font-semibold">Explore Events</h1>

        <p className="text-[18px] text-[#3D3E3E]">
          Discover amazing events happening across Abia State.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[225px_1fr]">
        <FilterSidebar slider={slider} setSlider={setSlider} />

        <main>
          <EventsTopBar count={events.length} />

          <EventGrid events={events} />

          <Pagination />
        </main>
      </div>

      <Updateed />
      <Patners />
    </div>
  );
};

export default Events;