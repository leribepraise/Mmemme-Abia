import React from "react";
import { MapPin } from "lucide-react";

const TourLocationCard = ({ tour }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-4">Location</h3>

      <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
        <img
          src={tour.mapImage || undefined}
          alt="Map"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <MapPin className="w-4 h-4" />
        <span>{tour.location}, Nigeria</span>
      </div>

      <button className="w-full border border-[#3F783D] text-[#3F783D] hover:bg-[#EAF4EB] font-semibold py-2.5 rounded-lg transition">
        View on Map
      </button>
    </div>
  );
};

export default TourLocationCard;
