import React from "react";
import { MapPin, Star } from "lucide-react";
import VenueStats from "./VenueStats";
import VenueTabs from "./VenueTabs";
import FacilitiesList from "./FacilitiesList";

const VenueInfo = ({ hotel }) => {
  const tags = hotel.amenities || [];

  return (
    <div className="space-y-8">
      <div id="hotel-overview" className="scroll-mt-28">
        <h1 className="text-4xl font-bold">{hotel.name}</h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>{hotel.location}</span>
          </div>

          <div className="flex items-center gap-1 text-orange-500">
            <Star className="w-4 h-4 fill-orange-500" />
            <span>
              {hotel.rating} ({hotel.reviews} reviews)
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="bg-[#E7E8E9] text-[#535454] text-xs px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-600 mt-6 leading-relaxed">
          {hotel.description}
        </p>
      </div>

      <VenueStats hotel={hotel} />

      <VenueTabs hotel={hotel} />

      <div id="hotel-facilities" className="scroll-mt-28"><FacilitiesList hotel={hotel} /></div>
    </div>
  );
};

export default VenueInfo;
