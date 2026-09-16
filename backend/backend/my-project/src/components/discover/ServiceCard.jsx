import React from "react";

const ServiceCard = ({ icon: Icon, title, text, color }) => {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-200 hover:shadow-sm transition">
      <Icon className={`w-6 h-6 ${color} mb-4`} />

      <h3 className="font-semibold text-[#1F2937] mb-3">{title}</h3>

      <p className="text-sm text-[#6B7280] leading-6">{text}</p>
    </div>
  );
};

export default ServiceCard;
