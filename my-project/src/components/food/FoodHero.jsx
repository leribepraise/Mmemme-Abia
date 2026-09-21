import React from "react";
import FoodSearchBar from "./FoodSearchBar";

const FoodHero = () => {
  return (
    <section className="relative">
      {/* Hero Container */}
      <div className="relative h-[240px] overflow-hidden rounded-b-[24px] md:h-[350px]">
        {/* Background Image with Top Alignment */}
        <img
          src="/food-hero.jpg"
          alt="Abia Food"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Text Content */}
        <div className="relative z-10 max-w-xl p-6 text-white md:p-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-green-300 md:text-sm">
            🍴 Delicious. Local. Delivered.
          </p>

          <h1 className="text-3xl font-extrabold leading-tight md:text-5xl">
            Taste the Flavors
            <br />
            of <span className="text-[#3F783D]">Abia</span>
          </h1>

          <p className="mt-3 max-w-md text-sm font-medium text-gray-100 leading-relaxed md:text-base">
            Discover local dishes, top restaurants, and trusted food vendors.
            From street food to fine dining.
          </p>
        </div>
      </div>

      <FoodSearchBar />
    </section>
  );
};

export default FoodHero;