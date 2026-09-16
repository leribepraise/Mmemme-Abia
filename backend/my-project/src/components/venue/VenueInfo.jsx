import React from "react";
import { MapPin, Star } from "lucide-react";
import VenueStats from "./VenueStats";
import VenueTabs from "./VenueTabs";
import FacilitiesList from "./FacilitiesList";

const VenueInfo = () => {
  const tags = [
    "Event Centre",
    "Conference",
    "Wedding",
    "Concerts",
    "Exhibitions",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Panyu Hotel Aba</h1>

        <div className="flex flex-wrap items-center gap-4 text-gray-500 mt-3">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <span>Aba, Abia State</span>
          </div>

          <div className="flex items-center gap-1 text-orange-500">
            <Star className="w-4 h-4 fill-orange-500" />
            <span>4.8 (98 reviews)</span>
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
          A modern multi-purpose event centre in the heart of Aba with
          state-of-the-art facilities for all types of events.
        </p>
      </div>

      <VenueStats />

      <VenueTabs />

      <FacilitiesList />
    </div>
  );
};

export default VenueInfo;
