import React from "react";

const FoodCategoryCard = ({ title, icon }) => {
  return (
    <button className="group flex min-w-[95px] sm:min-w-[115px] flex-col items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white p-3.5 shadow-sm transition hover:border-[#265F27] hover:shadow-md cursor-pointer shrink-0">
      {/* Icon Badge */}
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-50 text-2xl transition duration-300 group-hover:scale-110 group-hover:bg-[#265F27]/10">
        {icon}
      </div>

      {/* Category Title */}
      <p className="text-xs sm:text-sm font-extrabold text-gray-800 text-center leading-tight transition group-hover:text-[#265F27]">
        {title}
      </p>
    </button>
  );
};

export default FoodCategoryCard;