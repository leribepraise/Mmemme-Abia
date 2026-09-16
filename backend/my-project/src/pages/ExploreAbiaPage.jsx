import React from "react";
import {
  Calendar,
  Navigation,
  UserCheck,
  Home as HomeIcon,
  TreePine,
  Waves,
  Landmark,
  Mountain,
  Building2,
  Church,
  Flame,
  Gem,
  Compass,
  Camera,
  Ship,
} from "lucide-react";

import CategoryCard from "../components/tour/CategoryCard";
import DestinationCard from "../components/tour/DestinationCard";
import SidebarEvent from "../components/tour/SidebarEvent";
import TopActivityItem from "../components/tour/TopActivityItem";
import HeroSection from "../components/tour/HeroSection";

export default function ExploreAbiaPage() {
  const categories = [
    {
      icon: TreePine,
      title: "Nature & Parks",
      count: 234,
      color: "text-gray-700",
    },
    { icon: Waves, title: "Waterfalls", count: 28, color: "text-yellow-500" },
    {
      icon: HomeIcon,
      title: "Historical Sites",
      count: 86,
      color: "text-green-500",
    },
    {
      icon: Building2,
      title: "Caves & Hills",
      count: 34,
      color: "text-purple-500",
    },
    { icon: Church, title: "Museums", count: 15, color: "text-teal-500" },
    { icon: Ship, title: "Religious Sites", count: 42, color: "text-blue-500" },
    {
      icon: Building2,
      title: "Adventure",
      count: 36,
      color: "text-indigo-500",
    },
    {
      icon: Navigation,
      title: "Hidden Gems",
      count: 19,
      color: "text-pink-500",
    },
  ];

  const tours = [
    {
      image: "/tour1.jpg",
      tag: "Popular",
      text: "text-[#374151]",
      bg: "bg-[#FFFFFFE5]",
      name: "Arochukwu Long Juju",
      location: "Arochukwu, Abia State",
      rating: 4.8,
      reviews: 320,
      text2: "Historical Landmark",
      link: null,
    },
    {
      image: "/tour2.jpg",
      tag: "Top Rated",
      text: "text-[#F97316]",
      bg: "bg-[#FFFFFFE5]",
      name: "Arochukwu Waterfall",
      location: "Arochukwu, Abia State",
      rating: 4.9,
      reviews: 412,
      text2: "Waterfall",
      link: null,
    },
    {
      image: "/tour3.jpg",
      tag: "New",
      text: "text-white",
      bg: "bg-[#3B82F6]",
      name: "Isi-ume Cave",
      location: "Uturu",
      rating: 4.7,
      reviews: 156,
      text2: "Cave",
      link: null,
    },
    {
      image: "/tour4.jpg",
      tag: "Popular",
      text: "text-[#F97316]",
      bg: "bg-[#FFFFFFE5]",
      name: "Azumini Blue River",
      location: "Ukwa East, Abia State",
      rating: 4.6,
      reviews: 230,
      text2: "River & Nature",
      link: null,
    },
  ];
  return (
    <div className="min-h-screen bg-gray-50/50 font-sans text-gray-800 pb-16">
      <div className="max-w-[88rem] mx-auto px-4 md:px-8 pt-6">
        {/* TOP ROW: Hero Section (8 cols) + Upcoming Events Card (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-8 items-start">
          <div className="lg:col-span-8">
            <HeroSection />
          </div>

          <div className="lg:col-span-3 bg-white rounded-3xl p-3  shadow-sm h-full flex flex-col">
            <h3 className="font-extrabold text-base mb-5 text-[#111827]">
              Upcoming Events Near Attractions
            </h3>
            <div className="space-y-4">
              <SidebarEvent />
            </div>
          </div>
        </div>

        {/* SUBSEQUENT ROWS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mt-8">
          {/* LEFT / CENTER CONTENT AREA (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Explore Categories */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-black">
                  Explore Categories
                </h2>
                <button className="text-xs font-bold text-[#48782E] hover:underline">
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
            </section>

            {/* Top Destinations */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-extrabold text-black">
                  Top Destinations in Abia
                </h2>
                <button className="text-xs font-bold text-[#48782E] hover:underline">
                  View all destinations
                </button>
              </div>
              <div className="overflow-x-auto scrollbar-hide">
                <div className="flex gap-5 w-max pb-2">
                  {tours.map((tour) => (
                    <div key={tour.name} className="w-[260px] shrink-0">
                      <DestinationCard tour={tour} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Plan Your Trip */}
            <section>
              <h2 className="text-xl font-extrabold text-black mb-6">
                Plan Your Trip
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-green-50 text-[#48782E] flex items-center justify-center mb-4">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black mb-1">
                      Get Directions
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      Find the best route
                    </p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F36B25] flex items-center justify-center mb-4">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black mb-1">
                      Book a Tour Guide
                    </h4>
                    <p className="text-[10px] text-gray-400">Local experts</p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                    <HomeIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black mb-1">
                      Where to Stay
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      Hotels & Hostels
                    </p>
                  </div>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center mb-4">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-black mb-1">
                      Events Around You
                    </h4>
                    <p className="text-[10px] text-gray-400">Don’t miss out!</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Bottom Banner */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden shrink-0">
                  <img
                    src="beatify.jpg"
                    alt="Abia Emblem"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-black mb-1">
                    Abia is More Beautiful When You Experience It
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Create memories that last a lifetime.
                  </p>
                </div>
              </div>
              <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-800 font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-sm shrink-0">
                Explore More
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR AREA (4 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Getaway Card */}
            <div className="bg-[#15321E] rounded-3xl p-6 text-white shadow-sm relative overflow-hidden flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-lg mb-2">
                  Plan a Perfect Getaway
                </h3>
                <p className="text-xs text-gray-300 font-medium leading-relaxed mb-6">
                  Find attractions, places to stay, events and things to do -
                  all in one place.
                </p>
              </div>
              <div className="space-y-4">
                <button className="bg-[#F36B25] hover:bg-[#d95d1d] text-white font-bold text-xs py-3 px-6 rounded-xl transition-colors shadow-sm w-full">
                  Plan Your Trip
                </button>
                <div className="w-full h-32 bg-gray-800 rounded-2xl overflow-hidden border border-white/10">
                  <img
                    src="/map.jpg"
                    alt="Map Illustration"
                    className="w-full h-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Top Activities */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-base text-black mb-6">
                Top Activities
              </h3>
              <div className="space-y-4">
                <TopActivityItem
                  icon={Compass}
                  colorClass="bg-green-50 text-[#48782E]"
                  title="Guided Tours"
                  subtitle="Explore with professional guides"
                />
                <TopActivityItem
                  icon={Mountain}
                  colorClass="bg-orange-50 text-[#F36B25]"
                  title="Adventure & Hiking"
                  subtitle="Trails, hills and outdoor fun"
                />
                <TopActivityItem
                  icon={Camera}
                  colorClass="bg-blue-50 text-blue-600"
                  title="Photography Spots"
                  subtitle="Capture the beauty of Abia"
                />
                <TopActivityItem
                  icon={Ship}
                  colorClass="bg-teal-50 text-teal-600"
                  title="Boating & Water Activities"
                  subtitle="Enjoy rivers and natural waters"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
