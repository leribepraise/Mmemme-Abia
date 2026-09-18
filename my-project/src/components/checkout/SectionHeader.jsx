import React from "react";

const SectionHeader = ({ number, title }) => {
  return (
    <div className="mb-6 flex items-center gap-3.5">
      {/* STEP NUMBER BADGE */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#265F27] text-sm font-extrabold text-white shadow-xs">
        {number}
      </div>

      {/* SECTION TITLE */}
      <h2 className="text-xl font-extrabold text-gray-900 md:text-2xl">
        {title}
      </h2>
    </div>
  );
};

export default SectionHeader;