import React from "react";
import { Search } from "lucide-react";

const HelpSearch = () => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

      <input
        type="text"
        placeholder="Search for help..."
        className="w-full h-12 rounded-xl border border-gray-200 bg-white pl-12 pr-4 text-sm focus:outline-none focus:border-[#48782E]"
      />
    </div>
  );
};

export default HelpSearch;
