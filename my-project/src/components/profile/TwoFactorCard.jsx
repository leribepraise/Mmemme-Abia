import React from "react";
import { ShieldCheck } from "lucide-react";

const TwoFactorCard = () => {

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#EAF4EB] flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4 text-[#3F783D]" />
        </div>

        <div>
          <h3 className="font-bold text-base text-[#172033]">
            Account verification
          </h3>
          <p className="text-sm text-gray-500">
            Email verification is required when you create an account. Keep your email and password secure.
          </p>
        </div>
      </div>

    </div>
  );
};

export default TwoFactorCard;
