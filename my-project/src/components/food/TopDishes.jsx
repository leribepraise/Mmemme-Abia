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
    <section className="py-6">
      {/* SECTION HEADER */}
      <div className="mb-5 flex items-center justify-between px-1">
        <h2 className="text-xl font-extrabold text-gray-900 md:text-3xl">
          Top Dishes This Week
        </h2>

        <button className="text-base font-bold text-[#265F27] transition hover:underline md:text-lg">
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