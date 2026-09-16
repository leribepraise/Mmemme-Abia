import React from "react";
import FoodSearchBar from "./FoodSearchBar";

const FoodHero = () => {
  return (
    <section className="relative">
      {/* Hero */}
      <div className="relative h-[200px] md:h-[240px] rounded-b-[18px] overflow-hidden">
        <img
          src="/food-hero.jpg"
          alt="Abia Food"
          className="absolute inset-0 w-full h-full object-cover"
        />


        <div className="relative z-10 p-5 md:p-8 text-white max-w-xl">
          <p className="text-[10px] md:text-xs font-medium mb-2">
            🍴 Delicious. Local. Delivered.
          </p>

          <h1 className="text-2xl md:text-4xl font-bold leading-tight">
            Taste the Flavors
            <br />
            of <span className="text-[#3F783D]">Abia</span>
          </h1>

          <p className="text-[10px] md:text-xs mt-2 max-w-sm font-normal text-[#F3F4F6] leading-relaxed">
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
