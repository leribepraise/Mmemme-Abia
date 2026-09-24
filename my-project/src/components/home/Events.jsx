import { useCollection } from "@/hooks/useApi";
import { eventCard } from "@/lib/catalog";
import React from "react";

const Events = () => {
  const { data: events } = useCollection("/events/", eventCard);
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
