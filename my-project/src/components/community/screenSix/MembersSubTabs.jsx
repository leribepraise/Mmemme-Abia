import React from "react";

const subTabs = ["All", "Following", "Nearby"];

const MembersSubTabs = ({ activeSubTab, onSubTabChange }) => {
  return (
    <div className="flex gap-6 border-b border-gray-200">
      {subTabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onSubTabChange(tab)}
          className={`pb-2 text-sm font-medium border-b-2 -mb-px transition ${
            activeSubTab === tab
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

export default MembersSubTabs;
