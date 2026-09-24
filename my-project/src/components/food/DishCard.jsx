import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import React from "react";
import { Heart, Plus, Star } from "lucide-react";

const DishCard = ({ dish }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden min-w-[220px] sm:min-w-[250px] lg:flex-1 shadow-sm hover:shadow-md transition group">
      {/* Image */}
      <div className="relative h-36">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
        />

        <button aria-label="Save dish" onClick={() => toast("Saving dishes is not available yet.")} className="absolute top-2.5 right-2.5 bg-white/90 hover:bg-white rounded-full p-2 cursor-pointer shadow-sm transition">
          <Heart className="w-4 h-4 text-gray-600 hover:text-red-500 transition" />
        </button>
      </div>

      {/* Details */}
      <div className="p-4">
        <h3 className="font-extrabold text-base text-gray-900 truncate">
          {dish.name}
        </h3>

        <div className="flex items-center gap-1.5 mt-1.5">
          <Star className="w-4 h-4 text-[#F97316] fill-[#F97316]" />

          <span className="text-sm font-bold text-gray-800">{dish.rating}</span>
        </div>

        <div className="flex justify-between items-center mt-3">
          <p className="font-extrabold text-base text-gray-900">
            ₦{dish.price.toLocaleString()}
          </p>

          <button aria-label={`View ${dish.name} at restaurant`} onClick={() => navigate(`/fooddetail/${dish.restaurant}`)} className="w-8 h-8 bg-[#265F27] text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1e4a1f] shadow-sm transition">
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
