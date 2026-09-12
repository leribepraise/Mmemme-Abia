import React from "react";
import { useParams } from "react-router-dom";
import { hotels } from "../data/hotels";
import VenueGallery from "../components/venue/VenueGallery";
import VenueInfo from "../components/venue/VenueInfo";
import BookingCard from "../components/venue/BookingCard";

export default function VenueDetails() {
  const { id } = useParams();
  const hotel = hotels.find((h) => h.id === id);

  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8 text-center">
        <p className="text-lg font-semibold">Hotel not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500">Hotels &gt; {hotel.name}</div>

        <VenueGallery hotel={hotel} />

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8">
            <VenueInfo hotel={hotel} />
          </div>

          <div className="lg:col-span-4">
            <BookingCard hotel={hotel} />
          </div>
        </div>
      </div>
    </div>
  );
}
