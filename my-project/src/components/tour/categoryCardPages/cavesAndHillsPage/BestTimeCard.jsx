import React from "react";
import { Calendar } from "lucide-react";

const BestTimeCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-4">
        Best Time to Visit
      </h3>

      <div className="flex items-start gap-2">
        <Calendar className="w-4 h-4 text-[#3F783D] mt-0.5 shrink-0" />
        <div>
          <p className="text-sm text-[#172033] font-medium">November – April</p>
          <p className="text-xs text-gray-400">
            Best weather for hiking and exploration.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BestTimeCard;
