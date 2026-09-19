import React from "react";
import { ShieldCheck } from "lucide-react";

const AccountSecureBanner = () => {
  return (
    <div className="bg-[#EAF4EB] border border-green-200 rounded-xl p-4 flex items-center justify-between gap-4">
      <div>
        <p className="font-bold text-sm text-[#172033]">
          Your account is secure
        </p>
        <p className="text-sm text-gray-600">
          You're using a strong password and 2FA is enabled.
        </p>
      </div>

      <div className="w-8 h-8 rounded-full bg-[#3F783D] flex items-center justify-center shrink-0">
        <ShieldCheck className="w-4 h-4 text-white" />
      </div>
    </div>
  );
};

export default AccountSecureBanner;
