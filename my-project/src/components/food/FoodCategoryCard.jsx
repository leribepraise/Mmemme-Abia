import React from "react";

const FoodCategoryCard = ({ title, icon }) => {
  return (
    <button className="bg-white border border-gray-200 rounded-[10px] min-w-[75px] sm:min-w-[90px] h-[75px] sm:h-[85px] flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-[#48782E] transition cursor-pointer">
      <div className="text-lg">{icon}</div>

      <p className="text-[12px] sm:text-[9px] font-medium text-[#3D3E3E] text-center px-1">
        {title}
      </p>
    </button>
  );
};

export default FoodCategoryCard;
