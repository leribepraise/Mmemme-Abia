import Seo from "../components/seo/Seo";
import React from "react";
import {
  IoSearchOutline,
  IoChevronDownOutline,
  IoStar,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";

const results = [
  {
    id: 1,
    image: "/water1.jpg",
    title: "Ngwo Waterfalls",
    location: "Ngwo North, Abia State",
    rating: "4.7",
    reviews: "132",
    description:
      "A breathtaking natural waterfall surrounded by lush green forests, offering a serene escape for nature lovers and adventurers.",
    type: "Waterfall",
    price: "Free Entry",
  },
  {
    id: 2,
    image: "/water2.jpg",
    title: "Iyiogwe Waterfalls",
    location: "Ohafia Ngwa, Abia State",
    rating: "4.6",
    reviews: "98",
    description:
      "A beautiful multi-tier waterfall perfect for nature lovers, hiking, and a peaceful afternoon retreat.",
    type: "Waterfall",
    price: "Free Entry",
  },
  {
    id: 3,
    image: "/water3.jpg",
    title: "Abo River Falls",
    location: "Abo North, Abia State",
    rating: "4.5",
    reviews: "62",
    description:
      "A hidden gem with scenic beauty and cool waters, ideal for a quiet afternoon getaway.",
    type: "Waterfall",
    price: "Free Entry",
  },
];

const SearchResults = () => {
  return (
    <div className="min-h-screen bg-[#f7f8f8] px-4 pb-12 md:px-10 lg:px-16">
      <Seo title="Tourism in Abia State" description="Discover waterfalls, historical sites, nature and adventure spots to visit across Abia State." path="/tourism" />
      {/* SEARCH BAR */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.2fr_1fr_1fr_auto]">
          {/* Search Input */}
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="h-10 w-full rounded-lg border border-gray-300 pl-9 pr-3 text-xs outline-none transition focus:border-[#265F27]"
            />
          </div>

          {/* Location Select */}
          <div className="relative">
            <select className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700 outline-none transition focus:border-[#265F27]">
              <option>Any Location</option>
              <option>Abia State</option>
              <option>Enugu State</option>
              <option>Imo State</option>
            </select>
            <IoChevronDownOutline className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500" />
          </div>

          {/* Category Select */}
          <div className="relative">
            <select className="h-10 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700 outline-none transition focus:border-[#265F27]">
              <option>Any Category</option>
              <option>Tourism</option>
              <option>Events</option>
              <option>Stay</option>
              <option>Restaurants</option>
            </select>
            <IoChevronDownOutline className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500" />
          </div>

          {/* Search Button */}
          <button className="h-10 rounded-lg bg-[#F36B25] px-6 text-xs font-semibold text-white transition hover:bg-[#d95d1d]">
            Search
          </button>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
        {/* SIDEBAR */}
        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-base font-bold text-gray-900">Filter Results</h2>
            <button className="text-xs font-semibold text-[#265F27] hover:underline">
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div className="mb-5">
            <h3 className="mb-2.5 text-xs font-bold text-gray-800">
              Categories
            </h3>
            <div className="space-y-2">
              {[
                "All Categories",
                "Tourism",
                "Events",
                "Stay",
                "Hostels",
                "Restaurants",
                "Venues",
              ].map((category) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center gap-2 text-xs text-gray-600 hover:text-gray-900"
                >
                  <input
                    type="checkbox"
                    defaultChecked={category === "Tourism"}
                    className="h-3.5 w-3.5 rounded accent-[#265F27]"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mb-5">
            <h3 className="mb-2 text-xs font-bold text-gray-800">Location</h3>
            <div className="relative">
              <select className="h-9 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700 outline-none">
                <option>Any Location</option>
                <option>Abia State</option>
                <option>Enugu State</option>
              </select>
              <IoChevronDownOutline className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500" />
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="mb-2 text-xs font-bold text-gray-800">
              Price Range
            </h3>
            <div className="relative">
              <select className="h-9 w-full appearance-none rounded-lg border border-gray-300 bg-white px-3 text-xs text-gray-700 outline-none">
                <option>₦0 - ₦100,000+</option>
                <option>₦0 - ₦10,000</option>
                <option>₦10,000 - ₦50,000</option>
                <option>₦50,000+</option>
              </select>
              <IoChevronDownOutline className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500" />
            </div>
          </div>

          {/* Apply Button */}
          <button className="w-full rounded-xl bg-[#265F27] py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1d5524]">
            Apply Filters
          </button>
        </aside>

        {/* MAIN RESULTS */}
        <main className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between pb-1">
            <h1 className="text-xl font-bold text-gray-900">
              Search Results for <span className="text-[#265F27]">"Waterfall"</span>
            </h1>
            <span className="text-xs font-medium text-gray-500">
              125 Results Found
            </span>
          </div>

          {/* WATERFALL CARDS */}
          <div className="space-y-4">
            {results.map((result) => (
              <div
                key={result.id}
                className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 sm:flex-row">
                  <img
                    src={result.image}
                    alt={result.title}
                    className="h-40 w-full sm:w-48 shrink-0 rounded-xl object-cover"
                  />

                  <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">
                        {result.title}
                      </h2>
                      <p className="mt-0.5 text-xs text-gray-500">
                        📍 {result.location}
                      </p>

                      <div className="mt-2 flex items-center gap-1.5 text-xs">
                        <IoStar className="text-orange-500" />
                        <span className="font-bold text-orange-700">
                          {result.rating}
                        </span>
                        <span className="text-gray-400">
                          ({result.reviews} reviews)
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{result.type}</span>
                      </div>

                      <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-2">
                        {result.description}
                      </p>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#265F27]">
                        {result.price}
                      </span>
                      <button className="rounded-lg border border-[#265F27] px-4 py-1.5 text-xs font-semibold text-[#265F27] transition hover:bg-green-50">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* EVENT CARD */}
            <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm transition hover:shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative h-40 w-full sm:w-48 shrink-0 overflow-hidden rounded-xl">
                  <img
                    src="/water4.jpg"
                    alt="Waterfall Experience Tour"
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-2 top-2 rounded-md bg-[#F36B25] px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                    TOUR
                  </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between py-1">
                  <div>
                    <h2 className="text-base font-bold text-gray-900">
                      Waterfall Experience Tour
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-500">
                      📅 Sat, 14 Jun, 2025
                    </p>
                    <p className="mt-1 text-xs text-gray-400">Tour • Outdoor</p>
                    <p className="mt-2 text-xs leading-relaxed text-gray-600 line-clamp-2">
                      Guided tour to the most beautiful waterfalls in Abia. Includes transportation and light refreshments.
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div>
                      <p className="text-[10px] text-gray-400">From</p>
                      <p className="text-sm font-bold text-gray-900">₦15,000</p>
                    </div>
                    <button className="rounded-lg bg-[#265F27] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1d5524]">
                      Book Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAGINATION */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-1.5">
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-gray-400">
                <IoChevronBack className="text-xs" />
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#265F27] text-xs font-semibold text-white shadow-sm">
                1
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs text-gray-600 hover:border-gray-400">
                2
              </button>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-xs text-gray-600 hover:border-gray-400">
                3
              </button>
              <span className="flex h-8 w-8 items-center justify-center text-xs text-gray-400">
                ...
              </span>
              <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:border-gray-400">
                <IoChevronForward className="text-xs" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchResults;