import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MapPin,
  ListFilter,
  Clock3,
  UserRound,
  Search,
  ChevronDown,
} from "lucide-react";

const FoodSearchBar = () => {
  const [query, setQuery] = useState("");
  return (
    <div className="relative z-20 mx-3 -mt-4 md:mx-6 md:-mt-6">
      <div className="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-xl md:p-5">
        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Craving / Search Input */}
          <div className="flex items-center gap-3 border-b border-gray-200 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
            <MapPin className="h-5 w-5 shrink-0 text-[#265F27]" />

            <div className="w-full">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                What are you craving?
              </p>

              <input
                type="text"
                value={query} onChange={event => setQuery(event.target.value)} placeholder="Search food or cuisine..."
                className="w-full text-sm font-semibold text-gray-900 placeholder-gray-400 focus:outline-none md:text-base"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
            <div className="flex items-center gap-3">
              <ListFilter className="h-5 w-5 text-gray-400" />

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Category
                </p>
                <p className="text-sm font-bold text-gray-900 md:text-base">
                  All Categories
                </p>
              </div>
            </div>

            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>

          {/* Delivery Time */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-4">
            <div className="flex items-center gap-3">
              <Clock3 className="h-5 w-5 text-gray-400" />

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Delivery Time
                </p>

                <p className="text-sm font-bold text-gray-900 md:text-base">
                  Any Time
                </p>
              </div>
            </div>

            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>

          {/* Sort By */}
          <div className="flex items-center justify-between border-b border-gray-200 pb-3 lg:border-b-0 lg:pb-0">
            <div className="flex items-center gap-3">
              <UserRound className="h-5 w-5 text-gray-400" />

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Sort By
                </p>

                <p className="text-sm font-bold text-gray-900 md:text-base">
                  Recommended
                </p>
              </div>
            </div>

            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>

          {/* Search Button */}
          <NavLink to={`/search?q=${encodeURIComponent(query)}`}>
            <button className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#F97316] py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#ea580c] md:text-base">
              <Search className="h-5 w-5" />
              <span>Search Food</span>
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default FoodSearchBar;
