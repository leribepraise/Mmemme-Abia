import React from "react";

const HelpCard = ({ item }) => {
  const Icon = item.icon;

  return (
    <button className="w-full bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-sm transition text-left cursor-pointer">
      <div
        className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center`}
      >
        <Icon className={`w-5 h-5 ${item.color}`} />
      </div>

      <div>
        <h3 className="font-normal text-[#191C1D] text-[14px]">{item.title}</h3>

        <p className="text-[12px] text-[#3D3E3E] mt-1 font-normal">
          {item.subtitle}
        </p>
      </div>
    </button>
  );
};

export default HelpCard;
