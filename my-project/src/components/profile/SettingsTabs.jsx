import React from "react";
import {useNavigate} from "react-router-dom";

const tabs = ["Profile", "Security", "Payment Methods", "Preferences"];

const SettingsTabs = ({ activeTab = "Security", onTabChange }) => {
  const navigate=useNavigate();
  return (
    <div className="flex gap-6 border-b border-gray-200 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange ? onTabChange(tab) : navigate(`/profile?section=Settings&tab=${encodeURIComponent(tab)}`)}
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
