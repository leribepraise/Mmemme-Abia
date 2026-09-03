import React from "react";
import DishCard from "./DishCard";

const dishes = [
  {
    name: "Ofe Akwu Soup",
    image: "/dish1.jpg",
    rating: "4.8",
    price: "2,500",
  },
  {
    name: "Jollof Rice & Chicken",
    image: "/dish2.jpg",
    rating: "4.7",
    price: "2,200",
  },
  {
    name: "Pepper Soup",
    image: "/dish3.jpg",
    rating: "4.7",
    price: "1,800",
  },
  {
    name: "Suya (Beef)",
    image: "/dish4.jpg",
    rating: "4.6",
    price: "1,500",
  },
];

const TopDishes = () => {
  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-sm md:text-base">Top Dishes This Week</h2>

        <button className="text-[#48782E] text-[10px] md:text-xs font-semibold hover:underline">
          View all dishes
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {dishes.map((dish) => (
          <DishCard key={dish.name} dish={dish} />
        ))}
      </div>
    </section>
  );
};

export default TopDishes;
