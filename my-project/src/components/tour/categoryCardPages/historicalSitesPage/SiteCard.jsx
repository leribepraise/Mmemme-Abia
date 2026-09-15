import React from "react";
import { MapPin, Star, Heart } from "lucide-react";

const badgeColors = {
  Popular: "bg-[#3F783D]",
  "Top Rated": "bg-[#F97316]",
  New: "bg-[#3B82F6]",
};

const SiteCard = ({ site }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition">
      <div className="relative">
        <img
          src={site.image}
          alt={site.name}
          className="w-full h-40 object-cover"
        />

        {site.badge && (
          <span
            className={`absolute top-3 left-3 text-white text-xs font-semibold px-2 py-1 rounded ${
              badgeColors[site.badge] || "bg-gray-500"
            }`}
          >
            {site.badge}
          </span>
        )}

        <button className="absolute top-3 right-3 bg-white/80 p-1.5 rounded-full hover:bg-white transition">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-base text-[#172033]">{site.name}</h3>

        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>{site.location}</span>
        </div>

        <div className="flex items-center gap-1 text-sm mt-2">
          <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span className="font-semibold">{site.rating}</span>
          <span className="text-gray-400">({site.reviews})</span>
        </div>

        <span className="inline-block mt-3 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1 rounded-full">
          {site.category}
        </span>
      </div>
    </div>
  );
};

export default SiteCard;
