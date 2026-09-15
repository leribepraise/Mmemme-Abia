import React from "react";
import { Search } from "lucide-react";

const SearchBar = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-col md:flex-row gap-3">
      <div className="flex-1 relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          defaultValue="Waterfall"
          placeholder="Search..."
          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#3F783D]"
        />
      </div>

      <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none md:w-48">
        <option>Any Location</option>
      </select>

      <select className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none md:w-48">
        <option>Any Category</option>
      </select>

      <button className="bg-[#F97316] hover:bg-[#df5f18] text-white font-semibold px-6 py-2.5 rounded-lg transition">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
