import React from "react";
import { CheckCircle2 } from "lucide-react";

const AdventureTipsCard = ({ tips }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-4">
        Adventure Tips
      </h3>

      <div className="space-y-3">
        {tips.map((tip) => (
          <div key={tip} className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#3F783D] mt-0.5 shrink-0" />
            <p className="text-sm text-gray-600">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdventureTipsCard;
