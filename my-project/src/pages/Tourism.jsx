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
    <div className="min-h-screen bg-[#f7f8f8] px-4 py-5 md:px-10 lg:px-16">
      {/* SEARCH BAR */}
      <div className="mb-6 rounded-lg border border-gray-300 bg-white p-2">
        <div className="grid grid-cols-1 gap-2 md:grid-cols-[1.2fr_1.1fr_1.1fr_auto]">
          {/* Search */}
          <div className="relative">
            <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500" />

            <input
              type="text"
              placeholder="Search"
              className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-3 text-xs outline-none focus:border-green-700"
            />
          </div>

          {/* Location */}
          <div className="relative">
            <select className="h-9 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 text-xs text-gray-700 outline-none">
              <option>Any Location</option>
              <option>Abia State</option>
              <option>Enugu State</option>
              <option>Imo State</option>
            </select>

            <IoChevronDownOutline className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" />
          </div>

          {/* Category */}
          <div className="relative">
            <select className="h-9 w-full appearance-none rounded-md border border-gray-300 bg-white px-3 text-xs text-gray-700 outline-none">
              <option>Any Category</option>
              <option>Tourism</option>
              <option>Events</option>
              <option>Stay</option>
              <option>Restaurants</option>
            </select>

            <IoChevronDownOutline className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" />
          </div>

          {/* Search button */}
          <button className="h-9 rounded-md bg-orange-500 px-5 text-xs font-medium text-white transition hover:bg-orange-600">
            Search
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[145px_1fr] xl:grid-cols-[250px_1fr]">
        {/* SIDEBAR */}
        <aside className="h-fit rounded-lg border border-gray-300 bg-white p-3">
          <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="text-[20px] font-semibold text-[#000000]">
              Filter Results
            </h2>

            <button className="text-[12px] text-[#265F27] font-medium cursor-pointer">Clear All</button>
          </div>

          {/* Categories */}
          <div className="mb-4">
            <h3 className="mb-2 text-[14px] font-semibold text-[#191C1D]">
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
              ].map((category, index) => (
                <label
                  key={category}
                  className="flex cursor-pointer items-center gap-1.5"
                >
                  <input
                    type="checkbox"
                    defaultChecked={category === "Tourism"}
                    className="h-3 w-3 accent-green-700"
                  />

                  <span className="text-[14px] font-normal text-[#41493E]">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="mb-4">
            <h3 className="mb-2 text-[9px] font-semibold text-gray-800">
              Location
            </h3>

            <div className="relative">
              <select className="h-7 w-full appearance-none rounded border border-gray-300 bg-white px-2 text-[8px] outline-none">
                <option>Any Location</option>
                <option>Abia State</option>
                <option>Enugu State</option>
              </select>

              <IoChevronDownOutline className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px]" />
            </div>
          </div>

          {/* Price */}
          <div className="mb-5">
            <h3 className="mb-2 text-[9px] font-semibold text-gray-800">
              Price Range
            </h3>

            <div className="relative">
              <select className="h-7 w-full appearance-none rounded border border-gray-300 bg-white px-2 text-[8px] outline-none">
                <option>₦0 - ₦100,000+</option>
                <option>₦0 - ₦10,000</option>
                <option>₦10,000 - ₦50,000</option>
                <option>₦50,000+</option>
              </select>

              <IoChevronDownOutline className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[9px]" />
            </div>
          </div>

          {/* Apply */}
          <button className="w-full rounded-md bg-[#265F27] py-2 text-[14px] font-semibold text-white hover:bg-[#1d5524]">
            Apply Filters
          </button>
        </aside>

        {/* RESULTS */}
        <main>
          {/* Results header */}
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-[24px] font-bold text-gray-900">
              Search Results for "Waterfall"
            </h1>

            <span className="text-[14px] text-[#41493E]">
              125 Results Found
            </span>
          </div>

          {/* WATERFALL CARDS */}
          <div className="space-y-3">
            {results.map((result) => (
              <div
                key={result.id}
                className="rounded-lg border border-gray-300 bg-white p-2"
              >
                <div className="flex gap-3">
                  {/* IMAGE */}
                  <img
                    src={result.image}
                    alt={result.title}
                    className="h-[150px] w-[185px] shrink-0 rounded-md object-cover"
                  />

                  {/* DETAILS */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
                    <div>
                      <h2 className="text-[20px] font-semibold text-[#191C1D]">
                        {result.title}
                      </h2>

                      <p className="font-normal mt-0.5 text-[14px] text-[#41493E]">
                        ◉ {result.location}
                      </p>

                      <div className="mt-1 flex items-center gap-1 text-[8px]">
                        <IoStar className="text-[9px] text-orange-500" />

                        <span className="font-bold text-[14px] text-[#A73A00]">
                          {result.rating}
                        </span>

                        <span className="text-[16px] font-normal text-[#41493E]">
                          ({result.reviews} reviews)
                        </span>

                        <span className="text-[16px] font-normal text-[#41493E]">
                          • {result.type}
                        </span>
                      </div>

                      <p className="mt-2 max-w-[650px] font-normal text-[14px] leading-4 text-gray-500">
                        {result.description}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="rounded-full bg-green-100 px-2 py-1 text-[14px] font-semibold text-[#265F27]">
                        {result.price}
                      </span>

                      <button className="rounded-md border border-[#265F27] px-3 py-1 text-[14px] font-medium text-[#265F27] hover:bg-green-50">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* EVENT CARD */}
            <div className="rounded-lg border border-gray-300 bg-white p-2">
              <div className="flex gap-3">
                {/* IMAGE */}
                <div className="relative shrink-0">
                  <img
                    src="/water4.jpg"
                    alt="Waterfall Experience Tour"
                    className="h-[100px] w-[135px] rounded-md object-cover"
                  />

                  <span className="absolute left-1 top-1 rounded-sm bg-orange-600 px-1.5 py-0.5 text-[7px] font-semibold text-white">
                    TOUR
                  </span>
                </div>

                {/* EVENT DETAILS */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div>
                    <h2 className="text-[11px] font-bold text-gray-900">
                      Waterfall Experience Tour
                    </h2>

                    <p className="mt-1 text-[8px] text-gray-500">
                      ◉ Sat, 14 Jun, 2025
                    </p>

                    <p className="mt-1 text-[8px] text-gray-500">
                      Tour • Outdoor
                    </p>

                    <p className="mt-2 max-w-[650px] text-[8px] leading-4 text-gray-500">
                      Guided tour to the most beautiful waterfalls in Abia.
                      Includes transportation and light refreshments.
                    </p>
                  </div>

                  <div className="mt-2 flex items-end justify-between">
                    <div>
                      <p className="text-[7px] text-gray-500">From</p>

                      <p className="text-xs font-bold text-gray-900">₦15,000</p>
                    </div>

                    <button className="rounded-md bg-[#23652b] px-4 py-1.5 text-[8px] font-medium text-white hover:bg-[#1d5524]">
                      Book Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PAGINATION */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-1">
              <button className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white text-gray-400">
                <IoChevronBack className="text-[10px]" />
              </button>

              <button className="flex h-7 w-7 items-center justify-center rounded bg-[#23652b] text-[9px] font-semibold text-white">
                1
              </button>

              <button className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white text-[9px] text-gray-600">
                2
              </button>

              <button className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white text-[9px] text-gray-600">
                3
              </button>

              <button className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white text-[9px] text-gray-600">
                ...
              </button>

              <button className="flex h-7 w-7 items-center justify-center rounded border border-gray-300 bg-white text-gray-400">
                <IoChevronForward className="text-[10px]" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SearchResults;
