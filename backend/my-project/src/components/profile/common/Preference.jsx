import React from "react";

const Preference = ({ icon, label, value }) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2 text-gray-500">
        {icon}

        <span className="text-xs">{label}</span>
      </div>

      <span className="text-xs font-medium text-[#172033]">{value}</span>
    </div>
  );
};

export default Preference;
