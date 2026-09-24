import toast from "react-hot-toast";
import React, { useState } from "react";
import { ShieldCheck } from "lucide-react";

const TwoFactorCard = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#EAF4EB] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#3F783D]" />
        </div>

        <div>
          <h3 className="font-bold text-base text-[#172033]">
            Two-Factor Authentication (2FA)
          </h3>
          <p className="text-sm text-gray-500">
            Add an extra layer of security to your account.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => toast.error("Two-factor authentication is not configured yet.")}
        className={`w-11 h-6 rounded-full transition shrink-0 relative ${
          enabled ? "bg-[#3F783D]" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            enabled ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

export default TwoFactorCard;
