import React, { useState } from "react";
import {useSearchParams} from "react-router-dom";
import SettingsTabs from "./SettingsTabs";
import ProfileTabContent from "./ProfileTabContent";
import SecurityTabContent from "./SecurityTabContent";
import PaymentMethodsTabContent from "./PaymentMethodsTabContent";
import PreferencesTabContent from "./PreferencesTabContent";

const SettingsSection = ({ user }) => {
  const [params,setParams]=useSearchParams();
  const activeTab = ["Profile","Security","Payment Methods","Preferences"].includes(params.get('tab')) ? params.get('tab') : 'Profile';
  const setActiveTab = tab => setParams(previous=>{const next=new URLSearchParams(previous);next.set('tab',tab);return next;});

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
