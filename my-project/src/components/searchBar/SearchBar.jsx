import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm, activeCategory, setActiveCategory, locations, location, setLocation, onSearch }) => {
  return (
    <form onSubmit={e=>{e.preventDefault();onSearch();document.getElementById("search-results")?.scrollIntoView({behavior:"smooth"});}} className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col md:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#3F783D]"
        />
      </div>

      <select aria-label="Search location" value={location} onChange={e=>setLocation(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none md:w-48">
        <option>Any Location</option>
        {locations.map(value=><option key={value}>{value}</option>)}
      </select>

      <select aria-label="Search category" value={activeCategory} onChange={e=>setActiveCategory(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none md:w-48">
        {["All Categories","Events","Stay","Restaurants","Tourism"].map(value=><option key={value}>{value}</option>)}
      </select>

      <button className="bg-[#F97316] hover:bg-[#df5f18] text-white font-semibold px-6 py-2.5 rounded-lg transition">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
