import React from "react";
import {
  Ticket,
  Map,
  Landmark,
  Hotel,
  UtensilsCrossed,
  Bus,
  Users,
  Store,
} from "lucide-react";
import ServiceCard from "./ServiceCard";

const services = [
  {
    icon: Ticket,
    title: "Events & Ticket Booking",
    text: "Find events, book tickets, and reserve seats instantly.",
    color: "text-[#F97316]",
  },
  {
    icon: Map,
    title: "Tourism & Destinations",
    text: "Discover hidden places, historic sites, and plan your trip.",
    color: "text-[#265F27]",
  },
  {
    icon: Landmark,
    title: "Culture & Experiences",
    text: "Explore Abia's rich culture, heritage, and local festivals.",
    color: "text-[#265F27]",
  },
  {
    icon: Hotel,
    title: "Stays & Accommodation",
    text: "Find vetted hotels, apartments, and stays that fit your style.",
    color: "text-[#265F27]",
  },
  {
    icon: UtensilsCrossed,
    title: "Food Vendors & Dining",
    text: "Discover top restaurants, spot cafes, and local food vendors.",
    color: "text-[#F97316]",
  },
  {
    icon: Bus,
    title: "Transportation & Logistics",
    text: "Move around Abia easily with trusted transport and logistics.",
    color: "text-[#265F27]",
  },
  {
    icon: Users,
    title: "Community & Networking",
    text: "Connect, share, support, and grow with active residents.",
    color: "text-[#265F27]",
  },
  {
    icon: Store,
    title: "Local Businesses",
    text: "Support local artisans, service providers, and vendors.",
    color: "text-[#F97316]",
  },
];

const WhatYouCanDo = () => {
  return (
    <section className="space-y-10 md:space-y-12">
      {/* SECTION HEADER */}
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-black tracking-wider uppercase text-[#F97316]">
          What You Can Do With
        </p>

        <h2 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl lg:text-5xl">
          Mmemme Abia
        </h2>

        <p className="mt-3 text-base font-semibold text-gray-600 md:text-lg">
          Everything you need to discover, explore, and connect across Abia State in one place.
        </p>
      </div>

      {/* SERVICES GRID */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
};

export default WhatYouCanDo;