import React from "react";
import { IoSearch } from "react-icons/io5";

const SearchBar = () => {
  return (
    <>
      <div className="flex items-center gap-0 pl-5 mt-10 w-full rounded-[10px] h-20 bg-[#FFFEFE] shadow-[0_0_20px_rgba(0,0,0,0.15)]">
        <div className="flex items-center gap-2">
          <span className="text-[20px]">
            <IoSearch />
          </span>
          <input
            type="text"
            className="w-150 bg-[#FFFEFE] text-[18px] font-normal h-8 rounded-md placeholder:text-[#3D3E3E]"
            placeholder="Search events, concerts, venues, organizers..."
          />
        </div>
        <span className="flex gap-5">
          <span>
            <img src="/line.png" alt="" />
          </span>
          <div className="flex gap-2 items-center">
            <img src="/location.png" className="h-5 w-auto" />
            <select className="text-[18px] text-[#3D3E3E] pr-15">
              <option value="All location">All location</option>
            </select>
          </div>
        </span>
        <span className="flex gap-5">
          <span>
            <img src="/line.png" alt="" />
          </span>
          <div className="flex gap-2 items-center">
            <img src="/Vector (1).png" alt="" className="h-5 w-auto" />
            <select className="text-[18px] text-[#3D3E3E] pr-15">
              <option value="All location">All Date</option>
            </select>
          </div>
          <span>
            <img src="/line.png" alt="" />
          </span>
        </span>
        <button className="w-auto h-8 px-5 py-1 rounded-md text-[#FFFEFE] bg-[#3C6E16] ml-2">
          Search
        </button>
      </div>
    </>
  );
};

export default SearchBar;
