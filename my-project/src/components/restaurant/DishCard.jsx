import { useBooking } from "@/hooks/useBooking";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const DishCard = ({ dish }) => {
  const navigate = useNavigate();
  const { book, busy } = useBooking();

  const handleCardClick = () => {
    if (dish.path) {
      navigate(dish.path);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={`bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition ${
        dish.path ? "cursor-pointer" : ""
      }`}
    >
      <div className="relative">
        <img
          src={dish.image}
          alt={dish.name}
          className="w-full h-28 object-cover"
        />
      </div>

      <div className="p-3">
        <p className="text-[9px] text-gray-500">{dish.type}</p>

        <h3 className="font-bold text-sm text-gray-900 mt-1">{dish.name}</h3>

        <div className="flex items-center justify-between mt-2">
          <p className="font-bold text-sm">
            ₦
            {typeof dish.price === "number"
              ? dish.price.toLocaleString()
              : dish.price}
          </p>

          <button
            type="button"
            className="bg-[#48782E] text-white rounded-full w-5 h-5 flex items-center justify-center"
            disabled={busy || !dish.vendor?.accepts_orders || dish.quantity_available < 1}
            aria-label={`Order one ${dish.name} for pickup`}
            onClick={(e) => { e.stopPropagation(); book("FOOD", [{ id: dish.id, quantity: 1 }], { delivery_method: "PICKUP" }); }}
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
