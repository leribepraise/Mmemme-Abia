import React, { useState } from "react";
import FilterSidebar from "../components/events/FilterSidebar";
import EventsTopBar from "../components/events/EventsTopBar";
import EventGrid from "../components/events/EventGrid";
import Pagination from "../components/events/Pagination";
import Updateed from "../components/home/Updateed";
import Patners from "../components/home/Patners";
import { eventss } from "../data/eventData";

const Events = () => {
  const [slider, setSlider] = useState(0);

  return (
    <div className="min-h-screen bg-[#f5f7f3] px-4 py-5 md:px-6">
      <div className="mb-4">
        <h1 className="text-[25px] font-semibold">Explore Events</h1>

        <p className="text-[18px] text-[#3D3E3E]">
          Discover amazing events happening across Abia State.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[225px_1fr]">
        <FilterSidebar slider={slider} setSlider={setSlider} />

        <main>
          <EventsTopBar />

          <EventGrid events={eventss} />

          <Pagination />
        </main>
      </div>

      <Updateed />
      <Patners />
    </div>
  );
};

export default Events;
