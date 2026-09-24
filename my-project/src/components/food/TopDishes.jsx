import { useCollection } from '@/hooks/useApi';
import React from "react";
import DishCard from "./DishCard";

const TopDishes = () => {
  const { data: menu } = useCollection('/menu-items/');
  const dishes = menu.map(item => ({ ...item, price: Number(item.price), image: item.image || '/food1.jpg', rating: 'Not rated' }));
  return (
    <section id="available-dishes" className="py-6">
      {/* SECTION HEADER */}
      <div className="mb-5 flex items-center justify-between px-1">
        <h2 className="text-xl font-extrabold text-gray-900 md:text-3xl">
          Available Dishes
        </h2>

        <button onClick={() => document.getElementById("available-dishes")?.scrollIntoView({ behavior: "smooth" })} className="text-base font-bold text-[#265F27] transition hover:underline md:text-lg">
          View all dishes
        </button>
      </div>

      {/* HORIZONTAL CAROUSEL LIST */}
      <div className="scrollbar-hide flex gap-5 overflow-x-auto pb-4">
        {dishes.map((dish) => (
          <div key={dish.name} className="w-[220px] shrink-0 sm:w-[250px]">
            <DishCard dish={dish} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopDishes;
