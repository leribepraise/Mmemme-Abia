import React from "react";

const RestaurantGallery = () => {
  return (
    <div className="px-4 md:px-5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-auto md:h-[270px]">
        {/* Main Image */}
        <div className="md:col-span-8 h-[220px] md:h-full rounded-lg overflow-hidden">
          <img
            src="/restaurant-main.jpg"
            alt="Enyimba Garden Restaurant"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Small Images */}
        <div className="md:col-span-4 grid grid-cols-2 gap-2">
          <div className="h-[120px] md:h-full rounded-lg overflow-hidden">
            <img
              src="/restaurant-food.jpg"
              alt="Restaurant food"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="h-[120px] md:h-full rounded-lg overflow-hidden">
            <img
              src="/restaurant-interior.jpg"
              alt="Restaurant interior"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="col-span-2 relative h-[120px] md:h-full rounded-lg overflow-hidden">
            <img
              src="/restaurant-gallery.jpg"
              alt="Restaurant"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
              <button className="text-white text-xs font-semibold hover:underline">
                View All Photos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantGallery;
