import React, { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const ChangePasswordCard = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#EAF4EB] flex items-center justify-center shrink-0">
          <Lock className="w-4 h-4 text-[#3F783D]" />
        </div>

        <div>
          <h3 className="font-bold text-base text-[#172033]">
            Change Password
          </h3>
          <p className="text-sm text-gray-500">
            Update your password regularly to keep your account secure.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrent ? "text" : "password"}
              value={form.currentPassword}
              onChange={handleChange("currentPassword")}
              placeholder="Enter current password"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-green-700"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showCurrent ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              value={form.newPassword}
              onChange={handleChange("newPassword")}
              placeholder="Enter new password"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-green-700"
            />
            <button
              type="button"
              onClick={() => setShowNew((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showNew ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange("confirmPassword")}
              placeholder="Confirm new password"
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-sm outline-none focus:border-green-700"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showConfirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="button"
          className="bg-[#3F783D] hover:bg-[#356433] text-white font-semibold px-6 py-2.5 rounded-lg transition"
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default ChangePasswordCard;
