import React from "react";
import { ArrowRight } from "lucide-react";

const FoodDeliveryBanner = () => {
  return (
    <section className="my-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#265F27]/30 bg-[#F1FAF1] p-5 sm:flex-row md:p-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Banner Image */}
        <img
          src="/food-delivery.jpg"
          alt="Food delivery"
          className="h-16 w-16 shrink-0 rounded-xl object-cover shadow-sm sm:h-20 sm:w-20"
        />

        <div>
          {/* Headline */}
          <h3 className="text-base font-extrabold text-[#265F27] md:text-xl">
            Order from local restaurants
          </h3>

          {/* Subtext */}
          <p className="mt-1 text-xs font-medium leading-relaxed text-gray-600 md:text-sm">
            Choose a dish from an available menu and collect your order from the restaurant.
          </p>

          {/* Pagination Indicators */}
          <div className="mt-3 flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#265F27]"></span>
            <span className="h-2 w-2 rounded-full bg-gray-300"></span>
            <span className="h-2 w-2 rounded-full bg-gray-300"></span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <button onClick={() => document.getElementById("available-dishes")?.scrollIntoView({ behavior: "smooth" })} className="flex w-full cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-[#265F27] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#1e4a1f] sm:w-auto md:text-base">
        <span>Order Now</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </section>
  );
};

export default FoodDeliveryBanner;