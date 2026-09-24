import React from "react";

const tabs = ["Discussion", "Members", "Events", "Media"];

const GroupTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-6 border-b border-gray-200 px-5">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`pb-3 pt-3 text-sm font-medium border-b-2 -mb-px transition ${
            activeTab === tab
              ? "border-[#F97316] text-[#F97316]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default GroupTabs;
