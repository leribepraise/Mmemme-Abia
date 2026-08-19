import React from "react";
import VenueGallery from "../components/venue/VenueGallery";
import VenueInfo from "../components/venue/VenueInfo";
import BookingCard from "../components/venue/BookingCard";

export default function VenueDetails() {
  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500">
          Hotels &gt; Royal Spring Hotel
        </div>

        <VenueGallery />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <VenueInfo />
          </div>

          <div className="lg:col-span-4">
            <BookingCard />
          </div>
        </div>
      </div>
    </div>
  );
}
