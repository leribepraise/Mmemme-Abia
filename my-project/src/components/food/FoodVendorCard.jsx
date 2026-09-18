import React from "react";
import { Heart, Star } from "lucide-react";

const FoodVendorCard = ({ vendor }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden min-w-[260px] sm:min-w-[290px] lg:min-w-0 lg:flex-1 shadow-sm hover:shadow-md transition group">
      {/* Image Container */}
      <div className="relative h-36 sm:h-40">
        <img
          src={vendor.image}
          alt={vendor.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        {/* Badge */}
        <span className="absolute top-3 left-3 bg-[#265F27] text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
          OPEN
        </span>

        {/* Heart */}
        <button className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-full p-2 cursor-pointer shadow-sm transition">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-extrabold text-base text-gray-900 truncate">
          {vendor.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-2">
          <Star className="w-4 h-4 text-[#F97316] fill-[#F97316]" />

          <span className="text-sm font-bold text-gray-800">{vendor.rating}</span>

          <span className="text-sm font-medium text-gray-400">({vendor.reviews})</span>

          <span className="ml-auto bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-0.5 rounded-md">
            {vendor.cuisine}
          </span>
        </div>

        <p className="text-xs font-medium text-gray-500 mt-3">
          {vendor.time} · {vendor.distance}
        </p>

        <p className="text-xs font-semibold text-gray-400 mt-1">Min. order ₦1,000</p>
      </div>
    </div>
  );
};

export default FoodVendorCard;