import React from "react";
import { Search, ChevronDown, CalendarDays } from "lucide-react";

const FilterSidebar = ({ slider, setSlider }) => {
  const remaining = 3000 - slider;

  return (
    <aside className="h-fit rounded-xl bg-white p-3 shadow-md">
      <div className="mb-4 flex justify-between">
        <h2 className="text-[18px] font-bold">Filters</h2>

        <button className="text-[12px] font-normal text-[#3F783D]">
          Clear all
        </button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <label className="font-medium text-[16px] mb-1 block">Search</label>

          <input
            placeholder="Search events..."
            className="h-8 w-full rounded-md border px-2 pr-7 text-xs"
          />

          <Search size={13} className="absolute right-2 top-9 text-gray-500 cursor-pointer" />
        </div>

        <div className="relative">
          <label className="font-medium text-[16px] mb-1 block">Location</label>

          <select className="h-8 w-full appearance-none rounded-md border px-2 text-xs">
            <option>All locations</option>
          </select>

          <ChevronDown
            size={13}
            className="absolute right-2 top-8 text-gray-500 cursor-pointer"
          />
        </div>

        <div className="relative">
          <label className="mb-1 block text-sm">Date</label>

          <input
            placeholder="Select date"
            className="h-8 w-full rounded-md border px-2 pr-7 text-xs"
          />

          <CalendarDays
            size={13}
            className="absolute right-2 top-8 text-gray-500 cursor-pointer"
          />
        </div>

        <div>
          <label className="font-medium text-[16px] mb-1 block">
            Price Range
          </label>

          <input
            type="range"
            min="0"
            max="3000"
            value={slider}
            onChange={(e) => setSlider(Number(e.target.value))}
            className="w-full accent-[#3C6E16] cursor-pointer"
          />

          <div className="flex justify-between text-xs">
            <span>₦{slider}</span>

            <span>₦{remaining.toLocaleString()}</span>
          </div>
        </div>

        <button className="w-full rounded-md bg-[#3C6E16] py-2 text-white">
          Apply Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
