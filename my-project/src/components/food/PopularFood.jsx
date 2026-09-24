import React from "react";
import FoodVendorCard from "./FoodVendorCard";
import { useCollection } from "@/hooks/useApi";
import { restaurantCard } from "@/lib/catalog";

const PopularFood = () => {
  const { data: foodVendors } = useCollection("/restaurants/", restaurantCard);
  return (
    <section className="py-6">
      <div className="mb-5 flex items-center justify-between px-1">
        <h2 className="text-xl font-extrabold text-gray-900 md:text-3xl">
          Popular Near You
        </h2>

        <button className="text-base font-bold text-[#3F783D] transition hover:underline md:text-lg">
          View all vendors
        </button>
      </div>

      <div className="scrollbar-hide flex gap-5 overflow-x-auto pb-4">
        {foodVendors.map((vendor) => (
          <div key={vendor.id} className="w-[280px] shrink-0 sm:w-[320px]">
            <FoodVendorCard vendor={vendor} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularFood;
