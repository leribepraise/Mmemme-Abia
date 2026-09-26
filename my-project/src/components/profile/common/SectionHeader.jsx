// SectionHeader.jsx
import { Crown } from "lucide-react";

const SectionHeader = ({ title, description, plan }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-[#174A20]">{title}</h2>

        <p className="text-gray-500 mt-1">{description}</p>
      </div>
    </div>
  );
};

export default SectionHeader;
