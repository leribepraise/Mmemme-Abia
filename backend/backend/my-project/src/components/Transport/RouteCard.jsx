import React from "react";
import { Clock3 } from "lucide-react";

const RouteCard = ({ route }) => {
  return (
    <div className="min-w-[200px] bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="relative">
        <img
          src={route.image}
          alt={route.route}
          className="w-full h-28 object-cover"
        />

        <span className="absolute top-2 left-2 bg-[#48782E] text-white text-[10px] px-2 py-1 rounded">
          {route.tag}
        </span>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-sm">{route.route}</h3>

        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
          <Clock3 className="w-3 h-3" />
          {route.time}
        </div>

        <div className="mt-3">
          <p className="text-xs text-gray-400">From</p>
          <p className="text-[#48782E] font-bold">₦{route.price}</p>
        </div>
      </div>
    </div>
  );
};

export default RouteCard;
