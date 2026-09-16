import React from "react";
import RestaurantBreadcrumb from "../components/restaurant/RestaurantBreadcrumb";
import RestaurantGallery from "../components/restaurant/RestaurantGallery";
import RestaurantHeader from "../components/restaurant/RestaurantHeader";
import RestaurantStats from "../components/restaurant/RestaurantStats";
import RestaurantTabs from "../components/restaurant/RestaurantTabs";
import PopularDishes from "../components/restaurant/PopularDishes";
import RestaurantLocation from "../components/restaurant/RestaurantLocation";
import RestaurantAbout from "../components/restaurant/RestaurantAbout";
import RestaurantReview from "../components/restaurant/RestaurantReview";

const RestaurantDetails = () => {
  return (
    <div className="min-h-screen bg-[#F7F8F7] px-4 md:px-6 py-3">
      <div className="max-w-6xl mx-auto bg-white rounded-xl overflow-hidden">
        <RestaurantBreadcrumb />

        <RestaurantGallery />

        <RestaurantHeader />

        <RestaurantStats />

        <RestaurantTabs />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-5 pb-6">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">
            <PopularDishes />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <RestaurantAbout />
              <RestaurantReview />
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <RestaurantLocation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
