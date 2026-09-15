import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const CategoryTabs = ({ tabs = ["All"], defaultActive }) => {
  const [active, setActive] = useState(defaultActive || tabs[0]);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActive(tab)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              active === tab
                ? "bg-[#3F783D] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span>Sort by:</span>
        <button className="flex items-center gap-1 font-medium text-gray-900">
          Popular
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CategoryTabs;
