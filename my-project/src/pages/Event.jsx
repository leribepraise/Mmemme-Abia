import React, { useState, useMemo, useEffect } from "react";
import FilterSidebar from "../components/events/FilterSidebar";
import EventsTopBar from "../components/events/EventsTopBar";
import EventGrid from "../components/events/EventGrid";
import Pagination from "../components/events/Pagination";
import Updateed from "../components/home/Updateed";
import Patners from "../components/home/Patners";
import { useCollection } from "@/hooks/useApi";
import { eventCard } from "@/lib/catalog";

const EVENTS_PER_PAGE = 9;

const parsePrice = (text3) => {
  if (!text3) return 0;
  if (text3.toLowerCase() === "free") return 0;
  const digitsOnly = text3.replace(/[^0-9.]/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
};

const Events = () => {
  const { data: eventss } = useCollection("/events/", eventCard);
  const maxPrice = useMemo(
    () => Math.max(...eventss.map((e) => parsePrice(e.text3)), 0),
    [eventss],
  );

  const [slider, setSlider] = useState(maxPrice);
  useEffect(() => setSlider(maxPrice), [maxPrice]);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    location: "All locations",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const locations = useMemo(() => {
    const unique = new Set(eventss.map((e) => e.text2).filter(Boolean));
    return Array.from(unique);
  }, [eventss]);

  const filteredEvents = useMemo(() => {
    let result = eventss;

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        (event) =>
          event.text?.toLowerCase().includes(query) ||
          event.text2?.toLowerCase().includes(query),
      );
    }

    if (appliedFilters.location !== "All locations") {
      result = result.filter(
        (event) => event.text2 === appliedFilters.location,
      );
    }

    if (appliedFilters.date) {
      result = result.filter((event) => event.date === appliedFilters.date);
    }

    result = result.filter((event) => parsePrice(event.text3) <= slider);

    return result;
  }, [eventss, searchTerm, appliedFilters, slider]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredEvents]);

  const totalPages = Math.ceil(filteredEvents.length / EVENTS_PER_PAGE);

  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * EVENTS_PER_PAGE;
    return filteredEvents.slice(start, start + EVENTS_PER_PAGE);
  }, [filteredEvents, currentPage]);

  return (
    <div className="min-h-screen bg-[#f5f7f3] px-4 py-5 md:px-6">
      <div className="mb-4">
        <h1 className="text-[25px] font-semibold">Explore Events</h1>

        <p className="text-[18px] text-[#3D3E3E]">
          Discover amazing events happening across Abia State.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[225px_1fr]">
        <FilterSidebar
          slider={slider}
          setSlider={setSlider}
          maxPrice={maxPrice}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          locations={locations}
          onApply={setAppliedFilters}
        />

        <main>
          <EventsTopBar count={filteredEvents.length} />

          <EventGrid events={paginatedEvents} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </main>
      </div>

      <Updateed />
      <Patners />
    </div>
  );
};

export default Events;
