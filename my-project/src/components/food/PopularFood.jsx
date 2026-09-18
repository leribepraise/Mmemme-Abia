import React from "react";
import FoodVendorCard from "./FoodVendorCard";

const vendors = [
  {
    name: "Enyimba Garden Restaurant",
    image: "/food1.jpg",
    rating: "4.8",
    reviews: "320",
    cuisine: "Local Dishes",
    time: "15-25 mins",
    distance: "1.2 km",
    price: "₦₦",
  },
  {
    name: "De Royal Grill",
    image: "/food2.jpg",
    rating: "4.7",
    reviews: "201",
    cuisine: "Grills & BBQ",
    time: "20-30 mins",
    distance: "1.5 km",
    price: "₦₦",
  },
  {
    name: "Mama Cass Restaurant",
    image: "/food3.jpg",
    rating: "4.6",
    reviews: "150",
    cuisine: "Nigerian Cuisine",
    time: "20-30 mins",
    distance: "1.4 km",
    price: "₦₦",
  },
  {
    name: "Sweet Cravings",
    image: "/food4.jpg",
    rating: "4.6",
    reviews: "123",
    cuisine: "Snacks & Pastries",
    time: "15-20 mins",
    distance: "800 m",
    price: "₦₦",
  },
];

const PopularFood = () => {
  return (
    <section className="py-6">
      {/* SECTION HEADER */}
      <div className="mb-5 flex items-center justify-between px-1">
        <h2 className="text-xl font-extrabold text-gray-900 md:text-3xl">
          Popular Near You
        </h2>

        <button className="text-base font-bold text-[#3F783D] transition hover:underline md:text-lg">
          View all vendors
        </button>
      </div>

      {/* HORIZONTAL CAROUSEL */}
      <div className="scrollbar-hide flex gap-5 overflow-x-auto pb-4">
        {vendors.map((vendor) => (
          <div key={vendor.name} className="w-[280px] shrink-0 sm:w-[320px]">
            <FoodVendorCard vendor={vendor} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularFood;