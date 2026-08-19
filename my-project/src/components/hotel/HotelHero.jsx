import React from "react";
import { MapPin, Calendar, Users, Search } from "lucide-react";

const HotelHero = () => {
  return (
    <div
      className="rounded-3xl overflow-hidden p-6 md:p-8 text-white relative bg-cover bg-center"
      style={{ backgroundImage: "url('/hotel.png')" }}
    >
      <div className="absolute inset-0 bg-[#07152A]/90"></div>

      <div className="relative z-10">
        <p className="text-[#4ADE80] text-[14px] font-medium mb-3">
          Comfort. Hospitality. Unforgettable Memories.
        </p>

        <h1 className="text-4xl md:text-[48px] font-bold leading-tight">
          Find the Perfect Stay
          <br /> in
          <span className="text-[#F97316]"> Abia</span>
        </h1>

        <p className="text-[#E5E7EB] text-[16px] mt-4 max-w-lg font-normal">
          From luxury hotels to budget-friendly stays, find accommodation that
          fits your style and budget.
        </p>

        <div className="bg-white rounded-xl p-3 mt-8 grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <MapPin className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Where do you want to go?</p>
              <p className="font-medium">Search destination</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Calendar className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Check-in</p>
              <p className="font-medium">Select date</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Calendar className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Check-out</p>
              <p className="font-medium">Select date</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Users className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Guests & Rooms</p>
              <p className="font-medium">2 Guests, 1 Room</p>
            </div>
          </div>

          <button className="bg-[#F97316] hover:bg-[#dc5d19] rounded-[8px] py-3 text-white font-medium text-[14px] flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Search Hotels
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelHero;
