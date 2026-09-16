import React from "react";
import { MapPin } from "lucide-react";

const RestaurantLocation = () => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="p-4">
        <h2 className="font-bold text-sm">Location</h2>
      </div>

      {/* Map */}
      <div className="px-4">
        <div className="relative h-40 rounded-lg overflow-hidden bg-[#DFF2E2]">
          <img
            src="/restaurant-map.png"
            alt="Restaurant location map"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-[#48782E] shrink-0 mt-0.5" />

          <p className="text-[10px] text-gray-600 leading-relaxed">
            12 Azikwe Road, Umuahia, Abia State, Nigeria.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantLocation;
