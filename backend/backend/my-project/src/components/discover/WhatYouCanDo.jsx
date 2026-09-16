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
    text: "Find events, book tickets and reserve seats instantly.",
    color: "text-[#F97316]",
  },
  {
    icon: Map,
    title: "Tourism & Destinations",
    text: "Discover hidden places and plan your trip.",
    color: "text-[#48782E]",
  },
  {
    icon: Landmark,
    title: "Culture & Experiences",
    text: "Explore Abia's rich culture, heritage and local experiences.",
    color: "text-red-500",
  },
  {
    icon: Hotel,
    title: "Stays & Accommodation",
    text: "Find hotels, hostels and stays that fit your style.",
    color: "text-blue-500",
  },
  {
    icon: UtensilsCrossed,
    title: "Food Vendors",
    text: "Discover restaurants, cafés and local food vendors.",
    color: "text-orange-500",
  },
  {
    icon: Bus,
    title: "Transportation & Logistics",
    text: "Move around Abia with trusted transport and delivery.",
    color: "text-cyan-500",
  },
  {
    icon: Users,
    title: "Community",
    text: "Connect, share, support and grow with others.",
    color: "text-purple-500",
  },
  {
    icon: Store,
    title: "Local Businesses & Services",
    text: "Support local businesses and amazing people.",
    color: "text-indigo-500",
  },
];

const WhatYouCanDo = () => {
  return (
    <section className="space-y-8">
      <div className="text-center">
        <p className="text-[#F97316] text-xs font-bold uppercase mb-2">
          What You Can Do With
        </p>

        <h2 className="text-3xl font-bold text-[#1F2937]">Mmemme Abia</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {services.map((service) => (
          <ServiceCard key={service.title} {...service} />
        ))}
      </div>
    </section>
  );
};

export default WhatYouCanDo;
