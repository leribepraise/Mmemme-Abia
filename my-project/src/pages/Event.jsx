import Seo from "../components/seo/Seo";
import React, { useState, useMemo, useEffect } from "react";
import FilterSidebar from "../components/events/FilterSidebar";
import EventsTopBar from "../components/events/EventsTopBar";
import EventGrid from "../components/events/EventGrid";
import Pagination from "../components/events/Pagination";
import Updateed from "../components/home/Updateed";
import Patners from "../components/home/Patners";
import { getPublicEvents } from "../data/eventData";

const EVENTS_PER_PAGE = 9;

const parsePrice = (text3) => {
  if (!text3) return 0;
  if (text3.toLowerCase() === "free") return 0;
  const digitsOnly = text3.replace(/[^0-9]/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
};

const Events = () => {
  // Organizer-created events live in localStorage, so this is refreshed on
  // mount and whenever an organizer publishes/edits an event.
  const [events, setEvents] = useState(() => getPublicEvents());

  useEffect(() => {
    const refresh = () => setEvents(getPublicEvents());

    // Fired by OrganizerEventForm right after it saves to localStorage.
    window.addEventListener("mmemme-events-updated", refresh);
    // Fired automatically if another tab/window changes localStorage.
    window.addEventListener("storage", refresh);

    return () => {
      window.removeEventListener("mmemme-events-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  const maxPrice = useMemo(
    () => Math.max(...events.map((e) => parsePrice(e.text3)), 0),
    [events],
  );

  const [slider, setSlider] = useState(maxPrice);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({
    location: "All locations",
    date: "",
  });
  const [currentPage, setCurrentPage] = useState(1);

  // Keep the price slider's ceiling in sync if a newly published event
  // changes what the highest ticket price is.
  useEffect(() => {
    setSlider(maxPrice);
  }, [maxPrice]);

  const locations = useMemo(() => {
    const unique = new Set(events.map((e) => e.text2).filter(Boolean));
    return Array.from(unique);
  }, [events]);

  const filteredEvents = useMemo(() => {
    let result = events;

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
  }, [events, searchTerm, appliedFilters, slider]);

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
      <Seo title="Explore Events" description="Find and book concerts, business summits, festivals and more happening across Abia State." path="/events" />
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