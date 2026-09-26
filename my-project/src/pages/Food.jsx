import React from "react";
import SEO from "../components/SEO/SEO";
import FoodHero from "../components/food/FoodHero";
import FoodCategories from "../components/food/FoodCategories";
import PopularFood from "../components/food/PopularFood";
import TopDishes from "../components/food/TopDishes";
import FoodDeliveryBanner from "../components/food/FoodDeliveryBanner";

const Food = () => {
  return (
    <div className="min-h-screen bg-[#F7F8F7] px-4 md:px-6 lg:px-8 py-2">
      <SEO
        title="Food & Restaurants in Abia | Discover Local Food | Mmemme"
        description="Discover restaurants, local food and dining experiences across Abia State with Mmemme."
      />
      <div className="max-w-7xl mx-auto space-y-6">
        <FoodHero />

        <FoodCategories />

        <PopularFood />

        <TopDishes />

        <FoodDeliveryBanner />
      </div>
    </div>
  );
};

export default Food;
