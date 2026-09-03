import React from "react";
import FoodCategoryCard from "./FoodCategoryCard";

const categories = [
  {
    title: "Local Dishes",
    icon: "🍲",
  },
  {
    title: "Restaurants",
    icon: "🍽️",
  },
  {
    title: "Street Food",
    icon: "🍟",
  },
  {
    title: "Soups & Swallows",
    icon: "🥣",
  },
  {
    title: "Rice Dishes",
    icon: "🍚",
  },
  {
    title: "Grills & BBQ",
    icon: "🍖",
  },
  {
    title: "Drinks",
    icon: "🥤",
  },
  {
    title: "Snacks & Pastries",
    icon: "🥐",
  },
  {
    title: "Healthy Meals",
    icon: "🥗",
  },
];

const FoodCategories = () => {
  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-sm md:text-base text-[#1F2937]">
          Browse By Category
        </h2>

        <button className="text-[#3F783D] text-[14px] md:text-xs font-medium hover:underline">
          View all
        </button>
      </div>

      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <FoodCategoryCard key={category.title} {...category} />
        ))}
      </div>
    </section>
  );
};

export default FoodCategories;
