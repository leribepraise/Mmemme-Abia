import React from "react";
import { Check } from "lucide-react";

const SuccessIcon = () => {
  return (
    <div className="w-24 h-24 bg-[#48782E] rounded-full flex items-center justify-center mb-6 shadow-sm">
      <Check className="w-12 h-12 text-white" strokeWidth={4} />
    </div>
  );
};

export default SuccessIcon;
