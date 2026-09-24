import React from "react";
import { useParams } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { hotelCard } from "@/lib/catalog";
import VenueGallery from "../components/venue/VenueGallery";
import VenueInfo from "../components/venue/VenueInfo";
import BookingCard from "../components/venue/BookingCard";

export default function VenueDetails() {
  const { id } = useParams();
  const { data: hotel, loading, error } = useApi(`/hotels/${id}/`, { map: hotelCard });

  if (!hotel) {
    return (
      <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8 text-center">
        <p className="text-lg font-semibold">{loading ? "Loading hotel..." : error?.message || "Hotel not found"}</p>
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
