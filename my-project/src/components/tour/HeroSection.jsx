import React from "react";
import { NavLink } from "react-router-dom";
import {
  MapPin,
  ListFilter,
  CalendarDays,
  Compass,
  Search,
} from "lucide-react";

export default function HeroSection() {
  return (
    <div
      className="rounded-3xl overflow-hidden p-6 md:p-12 text-white relative bg-cover bg-center"
      style={{ backgroundImage: "url('/tourism.jpg')" }}
    >
      <div className="absolute inset-0 bg-[#07152A]/50"></div>

      <div className="relative z-10">
        <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">
          Explore the Beauty of <span className="text-[#F36B25]">Abia</span>
        </h1>

        <p className="text-[#E5E7EB] text-sm md:text-base mt-4 max-w-lg font-medium">
          From natural wonders to historic sites and hidden gems, explore the
          best destinations in God's Own State.
        </p>

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-3 mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-center">
          <div className="flex items-center gap-2 text-gray-700 text-sm p-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Where to?</p>
              <p className="font-medium text-gray-900">Search destinations</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm p-2">
            <ListFilter className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Category</p>
              <p className="font-medium text-gray-900">All Categories</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm p-2">
            <CalendarDays className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Date</p>
              <p className="font-medium text-gray-900">Anytime</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-700 text-sm p-2">
            <Compass className="w-4 h-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Travel Type</p>
              <p className="font-medium text-gray-900">All Types</p>
            </div>
          </div>

          <NavLink to="/search" className="w-full">
            <button className="w-full bg-[#F97316] hover:bg-[#dc5d19] rounded-[8px] py-3 text-white font-medium text-[14px] flex items-center justify-center gap-2 transition-colors">
              <Search className="w-4 h-4" />
              Search
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
