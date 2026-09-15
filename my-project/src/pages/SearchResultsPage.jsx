import React from "react";
import SearchBar from "../components/searchBar/SearchBar";
import FilterSidebar from "../components/searchBar/FilterSidebar"
import ResultCard from "../components/searchBar/ResultCard";

const results = [
  {
    id: 1,
    type: "place",
    image: "/waterfall1.jpg",
    name: "Arochukwu Waterfalls",
    location: "Arochukwu, Abia State",
    rating: 4.7,
    reviews: 132,
    category: "Waterfall",
    description:
      "The Arochukwu Waterfall, nestled within the captivating landscapes of Amannagwu Village in Arochukwu Kingdom, Abia State, Nigeria, holds a significant place in the region's history and natural allure.",
  },
  {
    id: 2,
    type: "place",
    image: "/waterfall2.jpg",
    name: "Iyiokoroafor Waterfalls",
    location: "Umunneochi, Abia State",
    rating: 4.6,
    reviews: 98,
    category: "Waterfall",
    description:
      "A major natural waterfall and historic spring located in Umuogele Amuda Isuochi, Umunneochi Local Government Area of Abia State. It features cool, clean flowing water surrounded by rocky terrain and lush greenery.",
  },
  {
    id: 3,
    type: "place",
    image: "/waterfall3.jpg",
    name: "Uturu Waterfall",
    location: "ABSU, Abia State",
    rating: 4.5,
    reviews: 62,
    category: "Waterfall",
    description:
      "A scenic natural attraction located at Ugwu Omangba in the Umuanyi Autonomous Community, positioned right behind Abia State University (ABSU) in Uturu, Abia State. The site features cascading water over rocky hill terrain surrounded by thick green vegetation.",
  },
  {
    id: 4,
    type: "event",
    image: "/waterfall-tour.jpg",
    name: "Waterfall Experience Tour",
    date: "Sat, 14 Jun, 2025",
    category: "Tour • Outdoor",
    description:
      "Guided tour to the most beautiful waterfalls in Abia. Includes transportation and light refreshments.",
    price: 15000,
  },
];

const SearchResultsPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F7F3] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <SearchBar />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR */}
          <div className="w-full lg:w-72 shrink-0">
            <FilterSidebar />
          </div>

          {/* RESULTS */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <h1 className="font-bold text-xl text-[#172033]">
                Search Results for "Waterfall"
              </h1>
              <span className="text-sm text-gray-400">125 Results Found</span>
            </div>

            <div className="space-y-4">
              {results.map((result) => (
                <ResultCard key={result.id} result={result} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
