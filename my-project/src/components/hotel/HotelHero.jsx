import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import { MapPin, Calendar, Users, Search } from "lucide-react";

const HotelHero = () => {
  const navigate=useNavigate();
  const [destination,setDestination]=useState("");
  return (
    <div className="px-4 md:px-6">
      <div
        className="rounded-3xl overflow-hidden p-6 md:p-12 text-white relative bg-cover bg-center"
        style={{ backgroundImage: "url('/hotel.png')" }}
      >
        <div className="absolute inset-0 bg-[#07152A]/40"></div>

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

          {/* Search Bar */}
          <div className="bg-white rounded-xl p-3 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-center">
            <div className="flex items-center gap-2 text-gray-700 text-sm p-2">
              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Where do you want to go?</p>
                <input aria-label="Hotel destination" placeholder="Search destination" className="w-full text-gray-900" value={destination} onChange={e=>setDestination(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")navigate(`/search?category=Stay&q=${encodeURIComponent(destination)}`);}}/>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700 text-sm p-2">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Check-in</p>
                <p className="font-medium text-gray-900">Choose at hotel</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700 text-sm p-2">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Check-out</p>
                <p className="font-medium text-gray-900">Choose at hotel</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-gray-700 text-sm p-2">
              <Users className="w-4 h-4 text-gray-400 shrink-0" />
              <div>
                <p className="text-xs text-gray-500">Guests & Rooms</p>
                <p className="font-medium text-gray-900">Choose your room</p>
              </div>
            </div>

            <button onClick={()=>navigate(`/search?category=Stay&q=${encodeURIComponent(destination)}`)} className="bg-[#F97316] hover:bg-[#dc5d19] rounded-[8px] py-3 text-white font-medium text-[14px] flex items-center justify-center gap-2 transition-colors">
              <Search className="w-4 h-4" />
              Search Hotels
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelHero;
