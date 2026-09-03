import React from "react";

const RestaurantTabs = () => {
  const tabs = ["Overview", "Menu", "Photos", "Reviews (220)", "Location"];

  return (
    <div className="px-4 md:px-5 border-b border-gray-200">
      <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`py-3 text-[10px] font-medium whitespace-nowrap ${
              index === 0
                ? "text-[#48782E] border-b-2 border-[#48782E]"
                : "text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RestaurantTabs;
