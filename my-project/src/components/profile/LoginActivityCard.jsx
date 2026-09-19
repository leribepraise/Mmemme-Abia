import React from "react";
import { Monitor } from "lucide-react";

const LoginActivityCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#EAF4EB] flex items-center justify-center shrink-0">
          <Monitor className="w-4 h-4 text-[#3F783D]" />
        </div>

        <div>
          <h3 className="font-bold text-base text-[#172033]">Login Activity</h3>
          <p className="text-sm text-gray-500">
            View where and when your account has been accessed.
          </p>
        </div>
      </div>

      <button className="text-[#3F783D] text-sm font-semibold hover:underline shrink-0">
        View Details
      </button>
    </div>
  );
};

export default LoginActivityCard;
