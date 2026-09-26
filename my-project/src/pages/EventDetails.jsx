import { useEffect } from "react";
import { useApi } from "@/hooks/useApi";
import { eventCard } from "@/lib/catalog";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { getPublicEventById } from "../data/eventData";
import Seo from "../components/seo/Seo";

import EventBreadcrumb from "../components/eventDetails/EventBreadcrumb";
import EventGallery from "../components/eventDetails/Gallary";
import EventHighlights from "../components/eventDetails/EventHighlights";
import TicketCard from "../components/eventDetails/TicketCard";
import AboutEvent from "../components/eventDetails/AboutEvent";
import LocationCard from "../components/eventDetails/LocationCard";
import SimilarEvents from "../components/eventDetails/SimilarEvents";

export default function EventDetails() {
  const { id } = useParams();

  const { data: event, loading, error } = useApi(`/events/${id}/`, { map: eventCard });
  const [tickets, setTickets] = useState({});
  const [enabledTiers, setEnabledTiers] = useState({});
  const [selectedImage, setSelectedImage] = useState('/event.jpg');
  useEffect(() => {
    if (!event) return;
    setSelectedImage(event.image);
    setTickets(Object.fromEntries(event.ticket_types.map(t => [t.id, Number(t.price) === 0 && t.quantity_available > 0 ? 1 : 0])));
    setEnabledTiers(Object.fromEntries(event.ticket_types.map(t => [t.id, Number(t.price) === 0])));
  }, [event]);
  const galleryImages = [event?.image || "/event.jpg"];

  const updateQuantity = (type, action) => {
    setTickets((prev) => ({
      ...prev,
      [type]:
        action === "increase" ? Math.min(20, event.ticket_types.find(t => t.id === type)?.quantity_available || 0, (prev[type] || 0) + 1) : Math.max(0, (prev[type] || 0) - 1),
    }));
  };

  const toggleTier = (type) => {
    setEnabledTiers((prev) => {
      const nowEnabled = !prev[type];

      // Turning OFF resets that tier's quantity to 0.
      // Turning ON leaves quantity at 0 until the user presses +.
      if (!nowEnabled) {
        setTickets((tPrev) => ({ ...tPrev, [type]: 0 }));
      }

      return { ...prev, [type]: nowEnabled };
    });
  };

  if (!event) return <p role="status">{loading ? "Loading event..." : error?.message || "Event unavailable."}</p>;
  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8 font-sans text-slate-800">
      <Seo
        title={event?.text}
        description={
          event?.description ||
          `${event?.text || "Event"} at ${event?.text2 || "Abia State"}. Get your tickets on Mmemme Abia.`
        }
        image={event?.image}
        path={`/events/${id}`}
      />
      <div className="max-w-7xl mx-auto space-y-6">
        <EventBreadcrumb eventName={event?.text} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <EventGallery
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                galleryImages={galleryImages}
                event={event}
              />

              <EventHighlights event={event} />
            </div>
          </div>

          <div className="lg:col-span-4">
            <TicketCard
              tickets={tickets}
              updateQuantity={updateQuantity}
              enabledTiers={enabledTiers}
              toggleTier={toggleTier}
              event={event}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <AboutEvent event={event} />

            <LocationCard event={event} />
          </div>

          <div className="lg:col-span-4">
            <SimilarEvents />
          </div>
        </div>
      </div>
    </div>
  );
}
