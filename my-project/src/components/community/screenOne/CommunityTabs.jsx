import React from "react";

const tabs = ["For You", "Trending", "My Groups", "Chats"];

const CommunityTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`pb-3 text-sm font-medium border-b-2 -mb-px transition ${
            activeTab === tab
              ? "border-[#3F783D] text-[#3F783D]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default CommunityTabs;
