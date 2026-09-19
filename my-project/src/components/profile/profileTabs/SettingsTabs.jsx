import React from "react";

const tabs = ["Profile", "Security", "Payment Methods", "Preferences"];

const SettingsTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-6 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`pb-3 text-sm font-medium border-b-2 -mb-px ${
            activeTab === tab
              ? "border-[#F97316] text-[#F97316]"
              : "border-transparent text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default SettingsTabs;
