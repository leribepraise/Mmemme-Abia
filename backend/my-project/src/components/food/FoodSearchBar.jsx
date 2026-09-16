import React from "react";
import {
  MapPin,
  ListFilter,
  Clock3,
  UserRound,
  Search,
  ChevronDown,
} from "lucide-react";

const FoodSearchBar = () => {
  return (
    <div className="relative z-20 -mt-2 md:-mt-4 mx-3 md:mx-5">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 md:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-center">
          {/* Location */}
          <div className="flex items-center gap-2 border-b sm:border-b-0 sm:border-r border-gray-200 pb-3 sm:pb-0 sm:pr-3">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />

            <div>
              <p className="text-[12px] text-[#6B7280] uppercase">
                What are you craving?
              </p>

              <p className="text-[14px] font-medium text-[#1F2937]">
                Search for food or cuisine
              </p>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between border-b sm:border-b-0 sm:border-r border-gray-200 pb-3 sm:pb-0 sm:pr-3">
            <div className="flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-gray-400" />

              <div>
                <p className="text-[12px] text-[#6B7280]">Category</p>
                <p className="text-[14px] font-medium text-[#1F2937]">
                  All Categories
                </p>
              </div>
            </div>

            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          {/* Delivery */}
          <div className="flex items-center justify-between border-b sm:border-b-0 sm:border-r border-gray-200 pb-3 sm:pb-0 sm:pr-3">
            <div className="flex items-center gap-2">
              <Clock3 className="w-4 h-4 text-gray-400" />

              <div>
                <p className="text-[12px] text-[#6B7280]">Delivery Time</p>

                <p className="text-[14px] text-[#1F2937] font-medium">
                  Any Time
                </p>
              </div>
            </div>

            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          {/* Sort */}
          <div className="flex items-center justify-between border-b lg:border-b-0 border-gray-200 pb-3 lg:pb-0">
            <div className="flex items-center gap-2">
              <UserRound className="w-4 h-4 text-gray-400" />

              <div>
                <p className="text-[12px] text-[#6B7280]">Sort By</p>

                <p className="text-[14px] font-medium text-[#1F2937]">
                  Recommended
                </p>
              </div>
            </div>

            <ChevronDown className="w-3 h-3 text-gray-400" />
          </div>

          {/* Search Button */}
          <button className="w-full bg-[#F95A1E] hover:bg-[#E8630D] text-white rounded-[12px] py-3 flex items-center justify-center gap-2 text-xs font-semibold transition cursor-pointer">
            <Search className="w-4 h-4" />
            Search Food
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodSearchBar;
