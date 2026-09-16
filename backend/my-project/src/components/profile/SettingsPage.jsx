import React from "react";

import SectionHeader from "./common/SectionHeader";

const SettingsPage = ({ user }) => {
  return (
    <div className="mx-auto max-w-[1100px]">
      <SectionHeader
        title="Settings"
        description="Manage your account and preferences."
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ACCOUNT INFORMATION */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-bold">Account Information</h2>

          <div className="mt-5 space-y-4">
            {/* FULL NAME */}
            <div>
              <label className="text-xs text-gray-500">Full Name</label>

              <input
                value={user.fullName || ""}
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-xs text-gray-500">Email</label>

              <input
                value={user.email || ""}
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
              />
            </div>

            {/* PHONE */}
            <div>
              <label className="text-xs text-gray-500">Phone Number</label>

              <input
                value={user.phone || ""}
                readOnly
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        {/* PREFERENCES */}
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-bold">Preferences</h2>

          <div className="mt-5 space-y-5">
            {/* NOTIFICATIONS */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Notifications</p>

                <p className="text-xs text-gray-500">Receive booking updates</p>
              </div>

              <input type="checkbox" defaultChecked />
            </div>

            {/* DARK MODE */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>

                <p className="text-xs text-gray-500">Use dark appearance</p>
              </div>

              <input type="checkbox" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
