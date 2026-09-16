import React, { useState } from "react";
import { CheckCheck } from "lucide-react";

const FilterTabs = ({ onFilterChange }) => {
  const tabs = ["All", "Updates", "Bookings", "Events", "Offers", "Community"];
  const [active, setActive] = useState("All");

  const handleClick = (tab) => {
    setActive(tab);
    onFilterChange?.(tab);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleClick(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              active === tab
                ? "bg-[#3F783D] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <button className="flex items-center gap-1.5 text-[#3F783D] text-sm font-medium hover:underline">
        <CheckCheck className="w-4 h-4" />
        Mark all as read
      </button>
    </div>
  );
};

export default FilterTabs;
