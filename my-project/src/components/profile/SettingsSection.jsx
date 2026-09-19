import React, { useState } from "react";
import SettingsTabs from "./SettingsTabs";
import ProfileTabContent from "./ProfileTabContent";
import SecurityTabContent from "./SecurityTabContent";
import PaymentMethodsTabContent from "./PaymentMethodsTabContent";
import PreferencesTabContent from "./PreferencesTabContent";

const SettingsSection = ({ user }) => {
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <div className="mx-auto max-w-[700px]">
      <h1 className="font-bold text-2xl text-[#172033] mb-1">
        Profile Settings
      </h1>

      <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Profile" && <ProfileTabContent user={user} />}
      {activeTab === "Security" && <SecurityTabContent user={user} />}

      {activeTab === "Payment Methods" && <PaymentMethodsTabContent />}

      {activeTab === "Preferences" && <PreferencesTabContent />}
    </div>
  );
};

export default SettingsSection;
