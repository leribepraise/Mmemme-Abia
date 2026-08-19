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
  Hotel as HotelIcon,
  MapPin,
  Moon,
  Briefcase,
  Users,
} from "lucide-react";

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

  const hotels = [
    {
      image: "/hotel.png",
      tag: "Popular",
      text: "text-[#374151]",
      bg: "bg-[#FFFFFFE5]",
      name: "Panyu Hotel",
      location: "Aba, Abia State",
      rating: 4.6,
      reviews: 435,
      price: 45000,
      link: "/panyu",
    },
    {
      image: "/hotel2.png",
      tag: "Top Rated",
      text: "text-[#F97316]",
      bg: "bg-[#FFFFFFE5]",
      name: "De King's Hotel",
      location: "Umuahia, Abia State",
      rating: 4.8,
      reviews: 320,
      price: 65000,
      link: null,
    },
    {
      image: "/hotel3.png",
      tag: "New",
      text: "text-white",
      bg: "bg-[#3B82F6]",
      name: "Paxton Suites & Apartments",
      location: "Umuahia, Abia State",
      rating: 4.5,
      reviews: 172,
      price: 35000,
      link: null,
    },
    {
      image: "/hotel4.png",
      tag: "Popular",
      text: "text-[#F97316]",
      bg: "bg-[#FFFFFFE5]",
      name: "Sunset Sands Hotel",
      location: "Arochukwu, Abia State",
      rating: 4.4,
      reviews: 210,
      price: 50000,
      link: null,
    },
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
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <HotelHero />
          </div>

          <div className="lg:col-span-3 space-y-4">
            <WhyBookCard />
            <DealCard />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          {/* Left Column */}
          <div className="flex-1 min-w-0 flex flex-col gap-10">
            {/* Browse By Category */}
            <div>
              <div className="flex justify-between mb-5">
                <h2 className="font-bold text-xl">Browse By Category</h2>
                <button className="text-green-700 font-semibold text-sm">
                  View all
                </button>
              </div>

              <div className="overflow-x-auto">
                <div className="flex gap-4 w-max pb-2">
                  {categories.map((cat) => (
                    <div key={cat.title} className="w-24 shrink-0">
                      <CategoryCard {...cat} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Hotels */}
            <div>
              <div className="flex justify-between mb-5">
                <h2 className="font-bold text-xl">Top Hotels in Abia</h2>
                <button className="text-green-700 font-semibold text-sm">
                  View all hotels
                </button>
              </div>

              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-5 w-max pb-2">
                  {hotels.map((hotel) => (
                    <div key={hotel.name} className="w-[260px] shrink-0">
                      <HotelCard hotel={hotel} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:w-64 lg:self-stretch">
            <div className="h-full">
              <DestinationCard />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-xl mb-5">Quick Hotel Finder</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {finder.map((item) => (
              <QuickFinderCard key={item.title} {...item} />
            ))}
          </div>
        </div>

        <HelpChoosing />
      </div>
    </div>
  );
}
