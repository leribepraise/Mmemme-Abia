import React from "react";
import { NavLink } from "react-router-dom";
import { MapPin, Calendar, Users, Search } from "lucide-react";

const HeroSection = () => {
  return (
    <div
      className="rounded-3xl overflow-hidden p-6 md:p-8 text-white relative bg-cover bg-center"
      style={{ backgroundImage: "url('/tourism.jpg')" }}
    >
      <div className="relative z-10">
        <h1 className="text-4xl md:text-[48px] font-bold leading-tight">
          Explore the Beauty
          <br /> of
          <span className="text-[#F97316]"> Abia</span>
        </h1>

        <p className="text-[#E5E7EB] text-[16px] mt-4 max-w-lg font-normal">
          From natural wonders to historic sites and hidden gems, explore the
          best destinations in God's Own State.
        </p>

        <div className="bg-white rounded-xl p-3 mt-8 grid grid-cols-2 md:grid-cols-5 gap-3 items-center">
          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <MapPin className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Where to?</p>
              <p className="font-medium">Search destination</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Calendar className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Category</p>
              <p className="font-medium">All Categories</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Calendar className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium">Anytime</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm">
            <Users className="w-4 h-4" />
            <div>
              <p className="text-xs text-gray-500">Travel Type</p>
              <p className="font-medium">All Types</p>
            </div>
          </div>

          <NavLink to="/search" className="cursor-pointer">
            <button className="bg-[#F97316] hover:bg-[#dc5d19] rounded-[8px] py-3 px-5 text-white font-medium text-[14px] flex items-center justify-center gap-2 cursor-pointer">
              <Search className="w-4 h-4" />
              Search
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
