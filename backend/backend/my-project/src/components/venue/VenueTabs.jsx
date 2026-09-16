import React from "react";

const VenueTabs = () => {
  const tabs = [
    "Overview",
    "Facilities",
    "Pricing",
    "Gallery",
    "Reviews (98)",
    "Location",
  ];

  return (
    <div className="flex gap-6 border-b border-gray-200 overflow-x-auto">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          className={`pb-3 whitespace-nowrap text-sm font-semibold ${
            i === 0
              ? "text-green-700 border-b-2 border-green-700"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default VenueTabs;
