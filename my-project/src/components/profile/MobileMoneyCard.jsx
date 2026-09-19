import React from "react";
import { Smartphone, MoreVertical } from "lucide-react";

const MobileMoneyCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-9 h-9 rounded-lg bg-[#EAF4EB] flex items-center justify-center shrink-0">
          <Smartphone className="w-4 h-4 text-[#3F783D]" />
        </div>

        <div>
          <h3 className="font-bold text-base text-[#172033]">Mobile Money</h3>
          <p className="text-sm text-gray-500">
            Link your mobile money account for seamless payments.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded">
            mtn
          </span>

          <div>
            <p className="text-sm font-semibold text-[#172033]">
              MTN Mobile Money
            </p>
            <p className="text-xs text-gray-400">+234 812 245 6789</p>
          </div>
        </div>

        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default MobileMoneyCard;
