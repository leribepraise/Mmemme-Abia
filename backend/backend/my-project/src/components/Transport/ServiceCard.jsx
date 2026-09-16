import React from "react";

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition">
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-24 object-cover rounded-lg"
      />

      <h3 className="font-semibold text-sm mt-3">{service.title}</h3>

      <p className="text-xs text-gray-500 mt-2 leading-5">{service.text}</p>

      <button className="mt-3 text-[#48782E] text-sm font-semibold hover:underline">
        {service.button} →
      </button>
    </div>
  );
};

export default ServiceCard;
