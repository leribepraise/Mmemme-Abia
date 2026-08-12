//
import React from "react";
import { IoSearch } from "react-icons/io5";

const SearchBar = () => {
  return (
    <>
      <div
        className="
          flex flex-col lg:flex-row
          items-stretch lg:items-center
          gap-4 lg:gap-0
          pl-5 pr-5
          mt-10
          w-full
          rounded-[10px]
          h-auto lg:h-20
          py-4 lg:py-0
          bg-[#FFFEFE]
          shadow-[0_0_20px_rgba(0,0,0,0.15)]
        "
      >
        {/* SEARCH INPUT */}
        <div className="flex items-center gap-2 w-full lg:w-auto">
          <span className="text-[20px]">
            <IoSearch />
          </span>

          <input
            type="text"
            className="
              w-full lg:w-150
              bg-[#FFFEFE]
              text-[18px]
              font-normal
              h-8
              rounded-md
              placeholder:text-[#3D3E3E]
            "
            placeholder="Search events, concerts, venues, organizers..."
          />
        </div>

        {/* LOCATION */}
        <span
          className="
            flex gap-5
            w-full lg:w-auto
          "
        >
          <span className="hidden lg:block">
            <img src="/line.png" alt="" />
          </span>

          <div className="flex gap-2 items-center w-full lg:w-auto">
            <img src="/location.png" className="h-5 w-auto" />

            <select
              className="
                text-[18px]
                text-[#3D3E3E]
                pr-5 lg:pr-15
                w-full lg:w-auto
              "
            >
              <option value="All location">All location</option>
            </select>
          </div>
        </span>

        {/* DATE */}
        <span
          className="
            flex gap-5
            w-full lg:w-auto
          "
        >
          <span className="hidden lg:block">
            <img src="/line.png" alt="" />
          </span>

          <div className="flex gap-2 items-center w-full lg:w-auto">
            <img src="/Vector (1).png" alt="" className="h-5 w-auto" />

            <select
              className="
                text-[18px]
                text-[#3D3E3E]
                pr-5 lg:pr-15
                w-full lg:w-auto
              "
            >
              <option value="All location">All Date</option>
            </select>
          </div>

          <span className="hidden lg:block">
            <img src="/line.png" alt="" />
          </span>
        </span>

        {/* SEARCH BUTTON */}
        <button
          className="
            w-full lg:w-auto
            h-8
            px-5
            py-1
            rounded-md
            text-[#FFFEFE]
            bg-[#3C6E16]
            ml-0 lg:ml-2
          "
        >
          Search
        </button>
      </div>
    </>
  );
};

export default SearchBar;
