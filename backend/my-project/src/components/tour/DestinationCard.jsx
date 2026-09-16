import React from "react";
import { NavLink } from "react-router-dom";
import { Star, Heart, Wifi, Car, Coffee, Utensils } from "lucide-react";

const DestinationCard = ({ tour }) => {
  return (
    <NavLink to={tour.link}>
      <div className="bg-white rounded-[12px] border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
        <div className="relative">
          <img src={tour.image} className="w-full h-44 object-cover" />

          <span
            className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold ${tour.text} ${tour.bg}`}
          >
            {tour.tag}
          </span>

          <button className="absolute top-3 right-3 bg-[#00000033] p-2 rounded-full">
            <Heart className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-base">{tour.name}</h3>

          <p className="text-sm text-gray-500">{tour.location}</p>

          <div className="flex items-center gap-1 text-sm mt-2">
            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-semibold">{tour.rating}</span>
            <span className="text-gray-400">({tour.reviews})</span>
          </div>

          <p className="mt-3 text-[12px] text-[#6B7280] font-medium">
            {tour.text2}
          </p>
        </div>
      </div>
    </NavLink>
  );
};

export default DestinationCard;
