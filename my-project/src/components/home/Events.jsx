import { useApi } from "@/hooks/useApi";
import PageSkeleton from '@/components/PageSkeleton';
import { eventCard } from "@/lib/catalog";
import React from "react";
import { useNavigate } from "react-router-dom";
import EventCard from "../events/EventCard";

const Events = () => {
  const navigate = useNavigate();
  const { data, loading } = useApi('/events/');
  const events = (data?.results || data || []).slice(0, 20).map(eventCard);
  if (loading) return <PageSkeleton/>;
  return (
    <>
      <section className="mt-10 overflow-hidden">
        <div className="flex items-center justify-between">
          <h1 className="text-[20px] font-semibold text-left mb-5">
            Trending Events 🔥
          </h1>
          <div>
            <button type="button"
              onClick={() => navigate("/events")}
              className="font-semibold text-[12px] text-[#F46F1A] cursor-pointer hover:underline"
            >
              See More
            </button>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex w-max gap-5 pb-3">
            {events.map((event) => <EventCard key={event.id} event={event} />)}
          </div>
        </div>
      </section>
    </>
  );
};

export default Events;
