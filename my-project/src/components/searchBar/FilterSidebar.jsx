import React from "react";

const FilterSidebar = () => {
  const categories = [
    "All Categories",
    "Tourism",
    "Events",
    "Stay",
    "Hostels",
    "Restaurants",
    "Venues",
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 h-fit">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-base">Filter Results</h2>
        <button className="text-[#3F783D] text-sm font-medium hover:underline">
          Clear All
        </button>
      </div>

      <hr className="border-gray-100 mb-4" />

      {/* CATEGORIES */}
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
                defaultChecked={cat === "Tourism"}
                className="w-4 h-4 rounded border-gray-300 text-[#3F783D] focus:ring-[#3F783D]"
              />
              {cat}
            </label>
          ))}
        </div>
      </div>

      {/* LOCATION */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Location</h3>
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none">
          <option>Any Location</option>
        </select>
      </div>

      {/* PRICE RANGE */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Price Range
        </h3>
        <select className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none">
          <option>₦0 - ₦100,000+</option>
        </select>
      </div>

      <button className="w-full bg-[#3F783D] hover:bg-[#356433] text-white font-semibold py-2.5 rounded-lg transition">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterSidebar;
