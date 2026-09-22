import React from "react";
import { Search } from "lucide-react";

const categories = [
  "All Categories",
  "Tourism",
  "Events",
  "Stay",
  "Hostels",
  "Restaurants",
  "Venues",
];

const priceRanges = [
  { label: "₦0 - ₦100,000+", max: Infinity },
  { label: "₦0 - ₦10,000", max: 10000 },
  { label: "₦10,000 - ₦50,000", max: 50000 },
  { label: "₦50,000 - ₦100,000", max: 100000 },
];

const FilterSidebar = ({
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  locations,
  locationDraft,
  setLocationDraft,
  priceDraft,
  setPriceDraft,
  onApply,
  onClearAll,
}) => {
  return (
    <aside className="h-fit rounded-xl bg-white p-5 shadow-sm">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="font-bold text-base">Filter Results</h2>
        <button
          onClick={onClearAll}
          className="text-xs font-semibold text-[#3F783D] hover:underline"
        >
          Clear All
        </button>
      </div>

      <hr className="border-gray-100 mb-4" />

      <div className="relative mb-5">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:border-[#3F783D]"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>

        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={activeCategory === cat}
                onChange={() => setActiveCategory(cat)}
                className="w-4 h-4 rounded border-gray-300 text-[#3F783D] focus:ring-[#3F783D]"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Location</h3>
        <select
          value={locationDraft}
          onChange={(e) => setLocationDraft(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none"
        >
          <option>Any Location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Price Range
        </h3>
        <select
          value={priceDraft}
          onChange={(e) => setPriceDraft(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none"
        >
          {priceRanges.map((range) => (
            <option key={range.label} value={range.max}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={onApply}
        className="w-full bg-[#3F783D] hover:bg-[#356433] text-white font-semibold py-2.5 rounded-lg transition"
      >
        Apply Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
