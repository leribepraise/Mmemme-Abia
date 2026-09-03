import React from "react";
import { MapPin, Star, Navigation } from "lucide-react";

const RestaurantHeader = () => {
  return (
    <div className="px-4 md:px-5 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">
            Enyimba Garden Restaurant
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Umuahia, Abia State</span>
            </div>

            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span className="font-semibold text-gray-700">4.8</span>
              <span>(220 reviews)</span>
            </div>

            <span>🍴 Nigerian, Continental</span>
          </div>
        </div>

        <button className="bg-[#F97316] hover:bg-[#E8630D] text-white px-4 py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition">
          <Navigation className="w-3.5 h-3.5" />
          Directions
        </button>
      </div>

      <p className="text-xs text-gray-600 mt-4 max-w-4xl leading-relaxed">
        A serene restaurant offering the best of local and continental dishes in
        a beautiful garden setting.
      </p>

      <div className="border-b border-gray-200 mt-4" />
    </div>
  );
};

export default RestaurantHeader;
