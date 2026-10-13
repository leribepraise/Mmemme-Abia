import { Link, useSearchParams } from "react-router-dom";
import Seo from "../components/seo/Seo";
import React from "react";
import SEO from "../components/SEO/SEO";
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

import { useCollection } from "@/hooks/useApi";
import { hotelCard } from "@/lib/catalog";

import HotelHero from "../components/hotel/HotelHero";
import WhyBookCard from "../components/hotel/WhyBookCard";
import DealCard from "../components/hotel/DealCard";
import DestinationCard from "../components/hotel/DestinationCard";
import CategoryCard from "../components/hotel/CategoryCard";
import HotelCard from "../components/hotel/HotelCard";
import QuickFinderCard from "../components/hotel/QuickFinderCard";
import HelpChoosing from "../components/hotel/HelpChoosing";

export default function Hotel() {
  const { data: hotels, loading, error } = useCollection('/hotels/', hotelCard);
  const [params] = useSearchParams();
  const range = params.get('check_in') && params.get('check_out');
  const { data: offers, loading: searching, error: searchError } = useCollection(range ? '/stay-search/?' + params.toString() : null);
  const query = (params.get('q') || '').toLowerCase();
  const visible = hotels.filter(h => (!params.get('type') || h.property_type === params.get('type')) && `${h.name} ${h.city}`.toLowerCase().includes(query) && (!range || offers.some(o => o.hotel === h.id)));
  const categories = [
    { icon: Building, title: 'All stays', type: '' },
    { icon: Building, title: 'Hotels', type: 'HOTEL' },
    { icon: Home, title: 'Guesthouses', type: 'GUESTHOUSE' },
    { icon: Building2, title: 'Apartments', type: 'APARTMENT' },
    { icon: Palmtree, title: 'Resorts', type: 'RESORT' },
    { icon: Bed, title: 'Holiday homes', type: 'HOLIDAY_HOME' },
  ].map(c => ({ ...c, count: hotels.filter(h => !c.type || h.property_type === c.type).length, color: 'text-green-700', path: c.type ? `/hotel?type=${c.type}` : '/hotel' }));
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
      <Seo title="Hotels in Abia State" description="Find and book hotels, guest houses and stays across Umuahia, Aba and beyond." path="/hotel" />
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Grid with Hero + Cards */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <div className="flex flex-wrap gap-3 mb-4"><Link to="/stays/provider" className="rounded-xl px-4 py-3 bg-[#3F7D3D] text-white font-semibold">Join / manage accommodation</Link><Link to="/stays/bookings" className="rounded-xl px-4 py-3 border font-semibold">My stays</Link></div><HotelHero key={params.toString()} />
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
              <h2 className="font-bold text-xl text-gray-900">
                Browse By Category
              </h2>
              <Link to="/search?category=Stay" className="text-green-700 font-semibold text-sm hover:underline">
                View all
              </Link>
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
            <DestinationCard hotels={hotels} />
          </div>
        </div>

        {(loading || searching) && <div role="status" aria-label="Loading accommodation" className="h-40 animate-pulse bg-gray-200 rounded-xl" />}
        {(error || searchError) && <p role="alert">{(error || searchError).message}</p>}
        {!loading && !searching && !error && !searchError && !visible.length && <p>No matching accommodation is currently available. <Link className="underline" to="/hotel">Clear filters</Link></p>}
        {/* Full Width Top Hotels Section */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-5">
            <h2 className="font-bold text-xl text-gray-900">
              Top Hotels in Abia
            </h2>
            <Link to="/search?category=Stay" className="text-green-700 font-semibold text-sm hover:underline">
              View all hotels
            </Link>
          </div>

          <div className="overflow-x-auto pb-4 scrollbar-hide">
            <div className="flex gap-5 w-max">
              {visible.map((hotel) => (
                <div key={hotel.id} className="w-[280px] shrink-0">
                  <HotelCard hotel={{...hotel, bookingQuery: range ? params.toString() : null}} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Hotel Finder */}
        <div>
          <h2 className="font-bold text-xl mb-5 text-gray-900">
            Quick Hotel Finder
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {finder.map((item) => (
              <Link key={item.title} to="/search?category=Stay"><QuickFinderCard {...item} /></Link>
            ))}
          </div>
        </div>

        {/* Help Choosing Banner */}
        <HelpChoosing />
      </div>
    </div>
  );
}
