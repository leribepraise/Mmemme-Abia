import React, { useState, useEffect, useRef } from "react";
import { todayInLagos } from '@/lib/dateOfBirth';
import toast from "react-hot-toast";
import { profileSchema } from "./profileSettingsSchemas/profileSchema";
import { Calendar, MapPin } from "lucide-react";
import { useUser } from "../context/UserContext";

const ProfileTabContent = () => {
  const [errors, setErrors] = useState({});
  const dateInput = useRef(null);

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

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    setSaved(false);
  };

  const handleSave = async () => {
    const result = profileSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0];

        if (!fieldErrors[field]) {
          fieldErrors[field] = issue.message;
        }
      });

      setErrors(fieldErrors);

      toast.error("Please fix the highlighted fields.");
      return;
    }

    setErrors({});
    try { await updateUser(result.data); setSaved(true); toast.success("Profile updated successfully!"); }
    catch (error) { toast.error(error.message); }
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
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

      <div className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Full Name
          </label>

          <input
            value={form.fullName || ""}
            onChange={handleChange("fullName")}
            className={`w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-green-700 ${
              errors.fullName ? "border-red-500" : "border-gray-200"
            }`}
          />

          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Email Address
          </label>

          <input
            type="email"
            value={form.email || ""}
            readOnly
            title="Contact support to change your verified email address."
            className={`w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-green-700 ${
              errors.email ? "border-red-500" : "border-gray-200"
            }`}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Phone Number (optional)
          </label>

          <input
            type="tel"
            value={form.phone || ""}
            onChange={handleChange("phone")}
            className={`w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-green-700 ${
              errors.phone ? "border-red-500" : "border-gray-200"
            }`}
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Your personal number is not shown on your public profile. You can clear it at any time.</p>
        </div>

        {/* Address */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Address (optional)
          </label>

          <div className="relative">
            <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />

            <input
              value={form.address || ""}
              onChange={handleChange("address")}
              className={`w-full rounded-lg border pl-9 pr-4 py-3 text-sm outline-none focus:border-green-700 ${
                errors.address ? "border-red-500" : "border-gray-200"
              }`}
            />
          </div>

          {errors.address && (
            <p className="mt-1 text-sm text-red-500">{errors.address}</p>
          )}
        </div>

        {/* LGA */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Local Government Area (optional)
          </label>

          <input
            value={form.lga || ""}
            onChange={handleChange("lga")}
            className={`w-full rounded-lg border px-4 py-3 text-sm outline-none focus:border-green-700 ${
              errors.lga ? "border-red-500" : "border-gray-200"
            }`}
          />

          {errors.lga && (
            <p className="mt-1 text-sm text-red-500">{errors.lga}</p>
          )}
        </div>

        {/* Date of Birth */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Date of Birth (optional)
          </label>

          <div className="relative">
            <input
              ref={dateInput}
              type="date"
              max={todayInLagos()}
              value={form.dateOfBirth || ""}
              onChange={handleChange("dateOfBirth")}
              className={`profile-date-input w-full rounded-lg border pl-4 pr-11 py-3 text-sm outline-none focus:border-green-700 ${
                errors.dateOfBirth ? "border-red-500" : "border-gray-200"
              }`}
            />

            <button type="button" aria-label="Choose date of birth" onClick={() => { if (dateInput.current?.showPicker) dateInput.current.showPicker(); else dateInput.current?.focus(); }} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 hover:bg-gray-100"><Calendar className="h-4 w-4" /></button>
          </div>

          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Save */}
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
  );
};

export default ProfileTabContent;
