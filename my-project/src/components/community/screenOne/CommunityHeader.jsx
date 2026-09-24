import React from "react";
import { Search } from "lucide-react";

const CommunityHeader = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="font-bold text-3xl text-[#172033]">Community</h1>
        <p className="text-sm text-gray-500 mt-1">
          Connect, share and grow together across Abia
        </p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search posts, groups, people..."
          className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none focus:border-[#3F783D]"
        />
      </div>
    </div>
  );
};

export default CommunityHeader;
