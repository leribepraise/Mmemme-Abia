import React from "react";
import ChangePasswordCard from "./ChangePasswordCard";
import TwoFactorCard from "./TwoFactorCard";
import LoginActivityCard from "./LoginActivityCard";
import AccountRecoveryCard from "./AccountRecoveryCard";
import AccountSecureBanner from "./AccountSecureBanner";
import SettingsTabs from "./SettingsTabs";
import { useUser } from "../context/UserContext";

const SecuritySettingsPage = () => {
  const { user } = useUser();

  return (
    <div className="mx-auto max-w-[700px]">
      <h1 className="font-bold text-2xl text-[#172033] mb-1">
        Profile Settings
      </h1>

      <SettingsTabs />

      <div className="mb-5">
        <h2 className="font-bold text-lg text-[#172033]">Security Settings</h2>
        <p className="text-sm text-gray-500">
          Keep your account safe and secure.
        </p>
      </div>

      <div className="space-y-4">
        <ChangePasswordCard />
        <TwoFactorCard />
        <LoginActivityCard />
        <AccountRecoveryCard user={user} />
        <AccountSecureBanner />
      </div>
    </div>
  );
};

export default SecuritySettingsPage;
