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
    <section>
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-sm md:text-base">Popular Near You</h2>

        <button className="text-[#3F783D] text-[14px] md:text-xs font-medium hover:underline">
          View all vendors
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
        {vendors.map((vendor) => (
          <FoodVendorCard key={vendor.name} vendor={vendor} />
        ))}
      </div>
    </section>
  );
};

export default PopularFood;
