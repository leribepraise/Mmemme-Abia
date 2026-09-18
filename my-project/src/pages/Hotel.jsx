import React from "react";
import {
  Building,
  Gem,
  Wallet,
  Store,
  Palmtree,
  Home,
  Building2,
  Bed,
  MapPin,
  Moon,
  Briefcase,
  Users,
} from "lucide-react";

import { hotels } from "../data/hotels";

import HotelHero from "../components/hotel/HotelHero";
import WhyBookCard from "../components/hotel/WhyBookCard";
import DealCard from "../components/hotel/DealCard";
import DestinationCard from "../components/hotel/DestinationCard";
import CategoryCard from "../components/hotel/CategoryCard";
import HotelCard from "../components/hotel/HotelCard";
import QuickFinderCard from "../components/hotel/QuickFinderCard";
import HelpChoosing from "../components/hotel/HelpChoosing";

export default function Hotel() {
  const categories = [
    { icon: Building, title: "All Hotels", count: 234, color: "text-gray-700" },
    { icon: Gem, title: "Luxury", count: 28, color: "text-yellow-500" },
    { icon: Wallet, title: "Budget", count: 86, color: "text-green-500" },
    { icon: Store, title: "Boutique", count: 34, color: "text-purple-500" },
    { icon: Palmtree, title: "Resorts", count: 15, color: "text-teal-500" },
    { icon: Home, title: "Guest Houses", count: 42, color: "text-blue-500" },
    {
      icon: Building2,
      title: "Apartments",
      count: 36,
      color: "text-indigo-500",
    },
    { icon: Bed, title: "Hostels", count: 19, color: "text-pink-500" },
  ];

  const finder = [
    {
      icon: MapPin,
      title: "Near Me",
      text: "Find hotels around your location.",
      color: "text-green-500",
      bg: "bg-[#F0FDF4]",
      iconBg: "bg-[#DCFCE7]",
    },
    {
      icon: Moon,
      title: "Tonight's Stay",
      text: "Book hotels for tonight",
      color: "text-orange-500",
      bg: "bg-[#FFF7ED]",
      iconBg: "bg-[#FFEDD5]",
    },
    {
      icon: Briefcase,
      title: "Long Stays",
      text: "Great deals for 7+ nights.",
      color: "text-blue-500",
      bg: "bg-[#EFF6FF]",
      iconBg: "bg-[#DBEAFE]",
    },
    {
      icon: Users,
      title: "Family Friendly",
      text: "Hotels perfect for your family.",
      color: "text-purple-500",
      bg: "bg-[#FAF5FF]",
      iconBg: "bg-[#F3E8FF]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Grid with Hero + Cards */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <HotelHero />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <WhyBookCard />
            <DealCard />
          </div>
        </div>

        {/* 2-Column Section for Category & Destination Sidebar */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-9 min-w-0">
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-bold text-xl text-gray-900">Browse By Category</h2>
              <button className="text-green-700 font-semibold text-sm hover:underline">
                View all
              </button>
            </div>

            <div className="overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-4 w-max">
                {categories.map((cat) => (
                  <div key={cat.title} className="w-24 shrink-0">
                    <CategoryCard {...cat} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Popular Destinations */}
          <div className="lg:col-span-3">
            <DestinationCard />
          </div>
        </div>

        {/* Full Width Top Hotels Section */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-xl text-gray-900">Top Hotels in Abia</h2>
            <button className="text-green-700 font-semibold text-sm hover:underline">
              View all hotels
            </button>
          </div>

          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-5 w-max">
              {hotels.map((hotel) => (
                <div key={hotel.id} className="w-[280px] shrink-0">
                  <HotelCard hotel={hotel} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Hotel Finder */}
        <div>
          <h2 className="font-bold text-xl mb-5 text-gray-900">Quick Hotel Finder</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {finder.map((item) => (
              <QuickFinderCard key={item.title} {...item} />
            ))}
          </div>
        </div>

        {/* Help Choosing Banner */}
        <HelpChoosing />

      </div>
    </div>
  );
}