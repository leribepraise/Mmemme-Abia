import React from "react";
import RouteCard from "./RouteCard";

const routes = [
  {
    image: "/first.png",
    route: "Umuahia → Aba",
    time: "30 mins (20 km)",
    price: "1,500",
    tag: "Most Popular",
  },
  {
    image: "/first2.png",
    route: "Umuahia → Owerri",
    time: "1 hr 20 mins (61 km)",
    price: "3,000",
    tag: "Top Route",
  },
  {
    image: "/first3.png",
    route: "Aba → Port Harcourt",
    time: "3 hrs (95 km)",
    price: "4,000",
    tag: "Popular",
  },
  {
    image: "/first4.jpg",
    route: "Umuahia → Enugu",
    time: "1 hr (60 km)",
    price: "2,500",
    tag: "Popular",
  },
  {
    image: "/first5.jpg",
    route: "Aba → Umuahia",
    time: "30 mins (20 km)",
    price: "1,500",
    tag: "Popular",
  },
  {
    image: "/first6.jpg",
    route: "Aba → Arochukwu",
    time: "3 hrs (120 km)",
    price: "1,500",
    tag: "Popular",
  },
];

const PopularRoutes = () => {
  return (
    <section className="space-y-4">
      <h2 className="font-bold text-xl">Popular Routes</h2>

      <div className="flex gap-4 scrollbar-none overflow-x-auto pb-2">
        {routes.map((route) => (
          <RouteCard key={route.route} route={route} />
        ))}
      </div>
    </section>
  );
};

export default PopularRoutes;
