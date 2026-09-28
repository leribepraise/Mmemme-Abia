import React from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const ServiceCard = ({ service }) => {
  const navigate=useNavigate();
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-md transition">
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-24 object-cover rounded-lg"
      />

      <h3 className="font-semibold text-sm mt-3">{service.title}</h3>

      <p className="text-xs text-gray-500 mt-2 leading-5">{service.text}</p>

      <button onClick={()=>service.title === "Event Shuttle" || service.title === "Bus Booking" ? navigate("/transport/shuttle") : toast("This transport service is not available yet. Scheduled shuttles are available in the Shuttle tab.")} className="mt-3 text-[#48782E] text-sm font-semibold hover:underline">
        {service.button} →
      </button>
    </div>
  );
};

export default ServiceCard;
