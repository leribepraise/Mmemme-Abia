import React from "react";
import DishCard from "./DishCard";

const dishes = [
  {
    name: "Afang Soup",
    type: "Main Dish",
    image: "/afang.jpg",
    price: "4,500",
    path: "/fooddetail",
  },
  {
    name: "Abia Jollof Rice",
    type: "Main Dish",
    image: "/jollof.jpg",
    price: "3,800",
    path: false,
  },
  {
    name: "Grilled Catfish",
    type: "Main Dish",
    image: "/catfish.jpg",
    price: "6,500",
    path: false,
  },
  {
    name: "Ugba & Abacha",
    type: "Appetizer",
    image: "/abacha.jpg",
    price: "3,000",
    path: false,
  },
];

const PopularDishes = () => {
  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm md:text-base font-bold text-gray-900">
          Popular Dishes
        </h2>

        <button className="text-[#48782E] text-[10px] font-semibold hover:underline">
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
