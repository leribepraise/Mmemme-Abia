import { useCollection } from "@/hooks/useApi";
import React from "react";
import DishCard from "./DishCard";

const PopularDishes = ({ vendor }) => {
  const { data: menu } = useCollection(`/menu-items/?restaurant=${vendor.id}`);
  const dishes = menu.map(item => ({ ...item, price: Number(item.price), image: item.image || "/food1.jpg", type: item.description, vendor }));

  if (dishes.length === 0) {
    return (
      <section id="restaurant-menu">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm md:text-base font-bold text-gray-900">
            Popular Dishes
          </h2>
        </div>

        <p className="text-xs text-gray-500">
          No dishes listed yet for this restaurant.
        </p>
      </section>
    );
  }

  return (
    <section id="restaurant-menu">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm md:text-base font-bold text-gray-900">
          Popular Dishes
        </h2>

        <button onClick={() => document.getElementById("restaurant-menu")?.scrollIntoView({ behavior: "smooth" })} className="text-[#48782E] text-[10px] font-semibold hover:underline">
          View Full Menu
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {dishes.map((dish) => (
          <DishCard key={dish.name} dish={dish} />
        ))}
      </div>
    </section>
  );
};

export default PopularDishes;
