import { useApi } from "@/hooks/useApi";
import PageSkeleton from "@/components/PageSkeleton";
import { eventCard } from "@/lib/catalog";
import React from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../events/EventCard";

const Events = () => {
  const navigate = useNavigate();
  const { data, loading } = useApi("/events/featured/");
  const events = (data || []).slice(0, 5).map(eventCard);
  if (loading) return <PageSkeleton />;
  return (
    <>
      <section className="mx-auto mt-10 w-full max-w-[1700px] overflow-hidden">
        <div className="mb-5 flex items-center justify-between lg:relative lg:justify-center">
          <h1 className="text-[20px] font-semibold">Trending Events 🔥</h1>
          <div className="lg:absolute lg:right-0">
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="font-semibold text-[12px] text-[#F46F1A] cursor-pointer hover:underline"
            >
              See More
            </button>
          </div>
        </div>
        <div className="my-10 overflow-x-auto scrollbar-hide py-10 px-5">
          <div className="flex justify-between gap-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Events;
