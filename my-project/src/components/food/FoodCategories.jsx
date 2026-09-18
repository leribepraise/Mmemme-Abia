import React from "react";
import FoodCategoryCard from "./FoodCategoryCard";

const categories = [
  { title: "Local Dishes", icon: "🍲" },
  { title: "Restaurants", icon: "🍽️" },
  { title: "Street Food", icon: "🍟" },
  { title: "Soups & Swallows", icon: "🥣" },
  { title: "Rice Dishes", icon: "🍚" },
  { title: "Grills & BBQ", icon: "🍖" },
  { title: "Drinks", icon: "🥤" },
  { title: "Snacks & Pastries", icon: "🥐" },
  { title: "Healthy Meals", icon: "🥗" },
];

const FoodCategories = () => {
  return (
    <section className="py-6">
      {/* SECTION HEADER */}
      <div className="mb-5 flex items-center justify-between px-1">
        <h2 className="text-xl font-extrabold text-gray-900 md:text-3xl">
          Browse By Category
        </h2>

        <button className="text-base font-bold text-[#265F27] transition hover:underline md:text-lg">
          View all
        </button>
      </div>

      {/* HORIZONTAL CATEGORIES ROW */}
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-3">
        {categories.map((category) => (
          <FoodCategoryCard key={category.title} {...category} />
        ))}
      </div>
    </section>
  );
};

export default FoodCategories;