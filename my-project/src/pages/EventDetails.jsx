import React, { useState } from "react";

import EventBreadcrumb from "../components/eventDetails/EventBreadcrumb";
import EventGallery from "../components/eventDetails/Gallary";
import EventHighlights from "../components/eventDetails/EventHighlights";
import TicketCard from "../components/eventDetails/TicketCard";
import AboutEvent from "../components/eventDetails/AboutEvent";
import LocationCard from "../components/eventDetails/LocationCard";
import SimilarEvents from "../components/eventDetails/SimilarEvents";

export default function EventDetails() {
  const [tickets, setTickets] = useState({
    regular: 1,
    vip: 1,
    vvip: 1,
  });

  const [selectedImage, setSelectedImage] = useState("/event.jpg");

  const galleryImages = [
    "/event.jpg",
    "/event2.jpg",
    "/event3.jpg",
    "/event4.jpg",
  ];

  const updateQuantity = (type, action) => {
    setTickets((prev) => ({
      ...prev,
      [type]:
        action === "increase" ? prev[type] + 1 : Math.max(0, prev[type] - 1),
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <EventBreadcrumb />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <EventGallery
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                galleryImages={galleryImages}
              />

              <EventHighlights />
            </div>
          </div>

          <div className="lg:col-span-4">
            <TicketCard tickets={tickets} updateQuantity={updateQuantity} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <AboutEvent />

            <LocationCard />
          </div>

          <div className="lg:col-span-4">
            <SimilarEvents />
          </div>
        </div>
      </div>
    </div>
  );
}
