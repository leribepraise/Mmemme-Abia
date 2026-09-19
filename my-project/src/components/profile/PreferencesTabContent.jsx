import React from "react";
import NotificationPreferencesCard from "./NotificationPreferencesCard";
import TravelPreferencesCard from "./TravelPreferencesCard";
import LanguageCard from "./LanguageCard";

const PreferencesTabContent = () => {
  return (
    <div>
      <div className="mb-5">
        <h2 className="font-bold text-lg text-[#172033]">Preferences</h2>
        <p className="text-sm text-gray-500">
          Customize your experience on Mmemme Abia.
        </p>
      </div>

      <div className="space-y-4">
        <NotificationPreferencesCard />
        <TravelPreferencesCard />
        <LanguageCard />
      </div>
    </div>
  );
};

export default PreferencesTabContent;
