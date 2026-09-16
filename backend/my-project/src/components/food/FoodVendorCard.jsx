import React from "react";
import { Heart, Star } from "lucide-react";

const FoodVendorCard = ({ vendor }) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden min-w-[240px] sm:min-w-[270px] lg:min-w-0 lg:flex-1 shadow-sm hover:shadow-md transition">
      {/* Image */}
      <div className="relative h-28 sm:h-32">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover"
        />

        {/* Badge */}
        <span className="absolute top-25 left-2 bg-[#22C55E] text-white text-[10px] font-bold px-2 py-1 rounded">
          OPEN
        </span>

        {/* Heart */}
        <button className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 cursor-pointer">
          <Heart className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-[11px] truncate">{vendor.name}</h3>

        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 text-orange-500 fill-orange-500" />

          <span className="text-[9px] font-semibold">{vendor.rating}</span>

          <span className="text-[9px] text-gray-400">({vendor.reviews})</span>

          <span className="ml-auto bg-gray-100 text-gray-500 text-[7px] px-1.5 py-0.5 rounded">
            {vendor.cuisine}
          </span>
        </div>

        <p className="text-[8px] text-gray-400 mt-2">
          {vendor.time} · {vendor.distance}
        </p>

        <p className="text-[8px] text-gray-400 mt-1">Min. order ₦1,000</p>
      </div>
    </div>
  );
};

export default FoodVendorCard;
