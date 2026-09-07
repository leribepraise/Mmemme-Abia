// SectionHeader.jsx
import { Crown } from "lucide-react";

const SectionHeader = ({ title, description, plan = "Free Plan" }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-[#174A20]">{title}</h2>

        <p className="text-gray-500 mt-1">{description}</p>
      </div>

      {/* Purchased Plan */}
      <div className="flex items-center gap-3 bg-[#EAF4EB] border border-[#CFE5D1] rounded-xl px-4 py-3">
        <div className="w-10 h-10 rounded-full bg-[#267A26] flex items-center justify-center">
          <Crown size={20} className="text-white" />
        </div>

        <div>
          <p className="text-xs text-gray-500">Current Plan</p>

          <p className="font-semibold text-[#267A26]">{plan}</p>
        </div>
      </div>
    </div>
  );
};

export default SectionHeader;
