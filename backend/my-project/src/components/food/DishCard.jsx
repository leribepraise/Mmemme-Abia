import React from "react";
import { Heart, Plus, Star } from "lucide-react";

const DishCard = ({ dish }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden min-w-[220px] sm:min-w-[250px] lg:flex-1 shadow-sm">
      {/* Image */}
      <div className="relative h-28">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
        />

        <button className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 cursor-pointer">
          <Heart className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>

      {/* Details */}
      <div className="p-3">
        <h3 className="font-semibold text-[11px]">{dish.name}</h3>

        <div className="flex items-center gap-1 mt-1">
          <Star className="w-3 h-3 text-orange-500 fill-orange-500" />

          <span className="text-[9px] font-semibold">{dish.rating}</span>
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="font-bold text-xs">₦{dish.price}</p>

          <button className="w-5 h-5 bg-[#064E3B] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#053f2f]">
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
