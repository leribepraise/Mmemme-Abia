import React from "react";
import ServiceCard from "./ServiceCard";

const services = [
  {
    image: "/transport1.jpg",
    title: "Ride",
    text: "Book a ride anytime, anywhere.",
    button: "Book Now",
  },
  {
    image: "/transport2.jpg",
    title: "Event Shuttle",
    text: "Comfortable shuttles to your events.",
    button: "Book Now",
  },
  {
    image: "/transport3.jpg",
    title: "Car Rental",
    text: "Rent a car for your personal or business trip.",
    button: "Rent Now",
  },
  {
    image: "/transport4.jpg",
    title: "Courier / Delivery",
    text: "Send packages across Abia with ease.",
    button: "Send Now",
  },
  {
    image: "/transport5.jpg",
    title: "Logistics Solutions",
    text: "For businesses and bulk deliveries.",
    button: "Learn More",
  },
  {
    image: "/transport6.jpg",
    title: "Bus Booking",
    text: "For businesses and bulk deliveries.",
    button: "Learn More",
  },
];

const TravelServices = () => {
  return (
    <section className="space-y-4">
      <h2 className="font-bold text-xl">Our Travel Services</h2>

      <div className="flex gap-4 scrollbar-hide overflow-x-auto pb-2">
        {services.map((service) => (
          <div key={service.title} className="min-w-[180px] md:min-w-[200px]">
            <ServiceCard service={service} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default TravelServices;
