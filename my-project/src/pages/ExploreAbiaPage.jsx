import { Link, useSearchParams } from "react-router-dom";
import React from "react";
import SEO from "../components/SEO/SEO";
import {
  Calendar,
  Navigation,
  UserCheck,
  Home as HomeIcon,
  TreePine,
  Waves,
  Building2,
  Church,
  Compass,
  Camera,
  Ship,
  Mountain,
} from "lucide-react";

import CategoryCard from "../components/tour/CategoryCard";
import DestinationCard from "../components/tour/DestinationCard";
import SidebarEvent from "../components/tour/SidebarEvent";
import TopActivityItem from "../components/tour/TopActivityItem";
import HeroSection from "../components/tour/HeroSection";

import { useCollection } from "@/hooks/useApi";
import { tourCard } from "@/lib/catalog";

export default function ExploreAbiaPage() {
  const { data: tours, loading, error } = useCollection("/tourism/", tourCard);
  const [params] = useSearchParams();
  const query = (params.get('q') || '').toLowerCase();
  const visibleTours = tours.filter(t => (!params.get('type') || t.category === params.get('type')) && `${t.name} ${t.location_name} ${t.description}`.toLowerCase().includes(query));
  const categories = [
    { icon: TreePine, title: 'Attractions', category: 'ATTRACTION' },
    { icon: HomeIcon, title: 'Cultural Sites', category: 'CULTURAL_SITE' },
    { icon: Compass, title: 'Activities', category: 'ACTIVITY' },
    { icon: Camera, title: 'Local Experiences', category: 'LOCAL_EXPERIENCE' },
  ].map(cat => ({ ...cat, count: tours.filter(t => t.category === cat.category).length, color: 'text-green-700', path: `/tourism?type=${cat.category}` }));
  return (
    <div className="min-h-screen bg-gray-50/50 pb-16 font-sans text-gray-800">
      <SEO
        title="Explore Abia Tourism | Destinations & Attractions | Mmemme"
        description="Explore Abia State's tourist destinations, attractions, historical sites, caves, hills and unforgettable experiences with Mmemme."
      />
      <div className="mx-auto max-w-[88rem] px-4 md:px-8">
        <div className="flex flex-wrap gap-3 py-5"><Link to="/tourism/operator" className="rounded-xl bg-[#3F7D3D] text-white px-4 py-3 font-semibold">Join / manage a tourism business</Link><Link to="/tourism/bookings" className="rounded-xl border px-4 py-3 font-semibold">My tour bookings</Link><Link to="/tourism/support" className="rounded-xl border px-4 py-3 font-semibold">Tourism support</Link></div>
        {loading && <div role="status" aria-label="Loading destinations" className="h-40 animate-pulse bg-gray-200 rounded-2xl mb-5" />}
        {error && <p role="alert">{error.message}</p>}
        {!loading && !error && !tours.length && <p className="mb-5">Approved destinations and tours will appear here when providers publish them.</p>}
        {/* TOP ROW: Enforced Alignment with items-stretch */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12">
          {/* Left Column: Hero Container */}
          <div className="flex h-full flex-col lg:col-span-8">
            <HeroSection key={params.toString()} />
          </div>

          {/* Right Column: Events Card - Top Aligned */}
          <div className="flex h-full flex-col rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-4">
            <h3 className="mb-5 text-base font-extrabold text-[#111827]">
              Upcoming Events Near Attractions
            </h3>
            <div className="flex-1 space-y-4">
              <SidebarEvent />
            </div>
          </div>
        </div>

        {/* SUBSEQUENT ROWS */}
        <div className="mt-8 grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* LEFT / MAIN CONTENT AREA */}
          <div className="space-y-12 lg:col-span-8">
            {/* Explore Categories */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-black">
                  Explore Categories
                </h2>
                <Link to="/search?category=Tourism" className="text-xs font-bold text-[#48782E] hover:underline">
                  View all
                </Link>
              </div>
              <div className="overflow-x-auto scrollbar-none">
                <div className="flex w-max gap-4 pb-2">
                  {categories.map((cat) => (
                    <div key={cat.title} className="w-24 shrink-0">
                      <CategoryCard {...cat}  />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Top Destinations */}
            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-black">
                  Top Destinations in Abia
                </h2>
                <Link to="/search?category=Tourism" className="text-xs font-bold text-[#48782E] hover:underline">
                  View all destinations
                </Link>
              </div>
              <div className="scrollbar-hide overflow-x-auto">
                <div className="flex w-max gap-5 pb-2">
                  {!loading && !visibleTours.length && <p>No matching destinations. <Link className="underline" to="/tourism">Clear filters</Link></p>}
                  {visibleTours.map((tour) => (
                    <div key={tour.name} className="w-[260px] shrink-0">
                      <DestinationCard tour={tour} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Plan Your Trip */}
            <section>
              <h2 className="mb-6 text-xl font-extrabold text-black">
                Plan Your Trip
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Link to="/search?category=Tourism" className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-[#48782E]">
                    <Navigation className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-black">
                      Get Directions
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      Find the best route
                    </p>
                  </div>
                </Link>

                <Link to="/search?category=Tourism" className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#F36B25]">
                    <UserCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-black">
                      Book a Tour Guide
                    </h4>
                    <p className="text-[10px] text-gray-400">Local experts</p>
                  </div>
                </Link>

                <Link to="/hotel" className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <HomeIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-black">
                      Where to Stay
                    </h4>
                    <p className="text-[10px] text-gray-400">
                      Hotels & Hostels
                    </p>
                  </div>
                </Link>

                <Link to="/events" className="flex flex-col justify-between rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-sm font-bold text-black">
                      Events Around You
                    </h4>
                    <p className="text-[10px] text-gray-400">Don’t miss out!</p>
                  </div>
                </Link>
              </div>
            </section>

            {/* Bottom Banner */}
            <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:flex-row md:p-8">
              <div className="flex items-center gap-5">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                  <img
                    src="beatify.jpg"
                    alt="Abia Emblem"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-extrabold text-black">
                    Abia is More Beautiful When You Experience It
                  </h3>
                  <p className="text-xs font-medium text-gray-500">
                    Create memories that last a lifetime.
                  </p>
                </div>
              </div>
              <Link to="/search?category=Tourism" className="shrink-0 rounded-xl border border-gray-300 bg-white px-6 py-3 text-sm font-bold text-gray-800 shadow-sm transition-colors hover:border-gray-400">
                Explore More
              </Link>
            </div>
          </div>

          {/* RIGHT SIDEBAR AREA */}
          <div className="space-y-6 lg:col-span-4">
            {/* Getaway Card */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-3xl bg-[#15321E] p-6 text-white shadow-sm">
              <div>
                <h3 className="mb-2 text-lg font-extrabold">
                  Plan a Perfect Getaway
                </h3>
                <p className="mb-6 text-xs font-medium leading-relaxed text-gray-300">
                  Find attractions, places to stay, events and things to do -
                  all in one place.
                </p>
              </div>
              <div className="space-y-4">
                <Link to="/contact" className="w-full rounded-xl bg-[#F36B25] py-3 px-6 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#d95d1d]">
                  Plan Your Trip
                </Link>
                <div className="h-32 w-full overflow-hidden rounded-2xl border border-white/10 bg-gray-800">
                  <img
                    src="/map.jpg"
                    alt="Map Illustration"
                    className="h-full w-full object-cover opacity-80"
                  />
                </div>
              </div>
            </div>

            {/* Top Activities */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-base font-extrabold text-black">
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
