import React from "react";
import { MapPin } from "lucide-react";

const NeedGuideCard = () => {
  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 h-32">
      <img
        src="/guide-thumb.jpg"
        alt="Find a local guide"
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4">
        <h3 className="text-white font-bold text-sm">Need a Guide?</h3>

        <button className="bg-[#F97316] hover:bg-[#df5f18] text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 w-fit transition">
          <MapPin className="w-3.5 h-3.5" />
          Find a Local Guide
        </button>
      </div>
    </div>
  );
};

export default NeedGuideCard;
