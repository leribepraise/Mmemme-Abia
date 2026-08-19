import React from "react";
import { NavLink } from "react-router-dom";
import { Star, Heart, Wifi, Car, Coffee, Utensils } from "lucide-react";

const HotelCard = ({ hotel }) => {
  return (
    <NavLink to={hotel.link}>
      <div className="bg-white rounded-[12px] border border-gray-200 overflow-hidden hover:shadow-md transition cursor-pointer">
        <div className="relative">
          <img src={hotel.image} className="w-full h-44 object-cover" />

          <span
            className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-semibold ${hotel.text} ${hotel.bg}`}
          >
            {hotel.tag}
          </span>

          <button className="absolute top-3 right-3 bg-[#00000033] p-2 rounded-full">
            <Heart className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-4">
          <h3 className="font-bold text-base">{hotel.name}</h3>

          <p className="text-sm text-gray-500">{hotel.location}</p>

          <div className="flex items-center gap-1 text-sm mt-2">
            <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span className="font-semibold">{hotel.rating}</span>
            <span className="text-gray-400">({hotel.reviews})</span>
          </div>

          <p className="mt-3 text-xl font-bold">
            From ₦{hotel.price.toLocaleString()}
          </p>

          <p className="text-xs text-gray-500">/ night</p>

          <div className="flex flex-wrap gap-3 mt-4 text-gray-400">
            <div className="flex justify-center items-center gap-1">
              <Wifi className="w-3 h-3" />
              <p className="text-[8px] text-[#6B7280]">Free Wi-Fi</p>
            </div>

            <div className="flex justify-center items-center gap-1">
              <Coffee className="w-3 h-3" />
              <p className="text-[8px] text-[#6B7280]">Breakfast</p>
            </div>

            <div className="flex justify-center items-center gap-1">
              <Car className="w-3 h-3" />
              <p className="text-[8px] text-[#6B7280]">Parking</p>
            </div>

            <div className="flex justify-center items-center gap-1">
              <Utensils className="w-3 h-3" />
              <p className="text-[8px] text-[#6B7280]">Pool</p>
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default HotelCard;
