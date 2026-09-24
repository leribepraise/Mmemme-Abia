import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useApi } from "@/hooks/useApi";
import { restaurantCard } from "@/lib/catalog";
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
  const { id } = useParams();
  const { data: vendor, loading, error } = useApi(`/restaurants/${id}/`, { map: restaurantCard });

  const [activeTab, setActiveTab] = useState("Overview");

  if (!vendor) {
    return (
      <div className="min-h-screen bg-[#F7F8F7] p-4 md:p-8 text-center">
        <p className="text-gray-500">{loading ? "Loading restaurant..." : error?.message || "Restaurant not found."}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8F7] px-4 md:px-6 py-3">
      <div className="max-w-6xl mx-auto bg-white rounded-xl overflow-hidden">
        <RestaurantBreadcrumb vendorName={vendor.name} />

        <RestaurantGallery vendor={vendor} />

        <RestaurantHeader vendor={vendor} />

        <RestaurantStats vendor={vendor} />

        <RestaurantTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          reviewCount={vendor.reviews}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-5 pb-6 pt-6">
          {/* LEFT */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === "Overview" && (
              <>
                <PopularDishes vendor={vendor} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RestaurantAbout vendor={vendor} />
                  <RestaurantReview vendor={vendor} />
                </div>
              </>
            )}

            {activeTab === "Menu" && <PopularDishes vendor={vendor} />}

            {activeTab === "Photos" && <RestaurantGallery vendor={vendor} />}

            {activeTab === "Reviews" && <RestaurantReview vendor={vendor} />}

            {activeTab === "Location" && <RestaurantLocation vendor={vendor} />}
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">
            <RestaurantLocation vendor={vendor} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
