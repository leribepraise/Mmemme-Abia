import React, { useState, useEffect } from "react";
import { Calendar, MapPin } from "lucide-react";

import SectionHeader from "./common/SectionHeader";
import { useUser } from "../context/UserContext";

const SettingsPage = () => {
  const { user, updateUser } = useUser();
  const [form, setForm] = useState(user);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setForm(user);
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 800 * 1024) {
      alert("Image must be under 800K");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profilePicture: reader.result }));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const tabs = ["Profile", "Security", "Payment Methods", "Preferences"];
  const activeTab = "Profile";

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateUser(form);
    setSaved(true);
  };

  return (
    <div className="mx-auto max-w-[700px]">
      <SectionHeader
        title="Profile Settings"
        description="Manage your account and preferences."
      />

      {/* TABS */}
      <div className="flex gap-6 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-3 text-sm font-medium border-b-2 -mb-px ${
              tab === activeTab
                ? "border-[#F97316] text-[#F97316]"
                : "border-transparent text-gray-500"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* PROFILE CARD */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        {/* PROFILE PHOTO */}
        <h2 className="font-bold text-base mb-4">Profile Photo</h2>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={form.profilePicture || "/avatar-placeholder.png"}
            alt=""
            className="w-16 h-16 rounded-full object-cover border border-gray-200"
          />

          <div>
            <label
              htmlFor="profile-photo-upload"
              className="inline-block cursor-pointer border border-green-700 text-green-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-50"
            >
              Change Photo
            </label>

            <input
              id="profile-photo-upload"
              type="file"
              accept="image/jpeg,image/png,image/gif"
              onChange={handlePhotoChange}
              className="hidden"
            />

            <p className="text-xs text-gray-400 mt-1">
              JPG, GIF or PNG. Max size of 800K
            </p>
          </div>
        </div>

        <hr className="border-gray-200 mb-6" />

        {/* FORM FIELDS */}
        <div className="space-y-5">
          {/* FULL NAME */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Full Name
            </label>
            <input
              value={form.fullName || ""}
              onChange={handleChange("fullName")}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-700"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Email Address
            </label>
            <input
              value={form.email || ""}
              onChange={handleChange("email")}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-700"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Phone Number
            </label>
            <input
              value={form.phone || ""}
              onChange={handleChange("phone")}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-green-700"
            />
          </div>

          {/* LOCATION (address + lga combined) */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                value={
                  form.address && form.lga
                    ? `${form.address}, ${form.lga}`
                    : form.address || form.lga || ""
                }
                onChange={(e) => {
                  // Free-typing here just overwrites address;
                  // lga stays as-is unless changed elsewhere (e.g. a dedicated LGA select).
                  setForm((prev) => ({ ...prev, address: e.target.value }));
                  setSaved(false);
                }}
                className="w-full rounded-lg border border-gray-200 pl-9 pr-4 py-3 text-sm outline-none focus:border-green-700"
              />
            </div>
          </div>

          {/* DATE OF BIRTH */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Date of Birth
            </label>
            <div className="relative">
              <input
                type="date"
                value={form.dateOfBirth || ""}
                onChange={handleChange("dateOfBirth")}
                className="w-full rounded-lg border border-gray-200 pl-4 pr-9 py-3 text-sm outline-none focus:border-green-700"
              />
              <Calendar className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="bg-[#3F783D] hover:bg-[#356433] text-white font-semibold px-6 py-3 rounded-lg"
            >
              Save Changes
            </button>

            {saved && <span className="text-sm text-green-700">Saved!</span>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
