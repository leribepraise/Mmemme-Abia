import React from "react";

const Info = ({ label, value, green = false }) => {
  return (
    <div className="mb-4">
      <p className="text-[9px] text-gray-400">{label}</p>

      <p
        className={`
          mt-1 text-xs font-medium

          ${green ? "text-orange-500" : "text-[#172033]"}
        `}
      >
        {value}
      </p>
    </div>
  );
};

export default Info;
