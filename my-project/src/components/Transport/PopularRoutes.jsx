import { useCollection } from "@/hooks/useApi";
import React from "react";
import RouteCard from "./RouteCard";



const PopularRoutes = () => {
  const { data: catalog } = useCollection('/transport-routes/');
  const { data: departures } = useCollection('/departures/');
  const routes = catalog.map(route => { const trips = departures.filter(d => d.route === route.id && d.quantity_available > 0); return { ...route, route: `${route.origin} → ${route.destination}`, image: '/first.png', time: route.pickup_address, price: trips.length ? Math.min(...trips.map(d => Number(d.price))).toLocaleString() : '—', tag: trips.length ? 'Available' : 'No departures' }; });
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
