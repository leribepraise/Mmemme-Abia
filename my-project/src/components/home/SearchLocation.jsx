import React from "react";

//icons
import { IoSearch } from "react-icons/io5";
import { IoLocationOutline } from "react-icons/io5";
import { ImCalendar } from "react-icons/im";

function SearchLocation() {
  return (
    <section className="mt-5 px-10">
      <div className="w-full bg-[#FFFEFE] shadow-md rounded-2xl">
        <form className="flex justify-between items-center p-5 rounded-2xl">
          <div className="w-1/2 relative border-r border-gray-300">
            <label
              htmlFor="search"
              className="absolute top-0 translate-y-1 text-2xl"
            >
              <IoSearch />
            </label>
            <input
              type="text"
              id="search"
              name="search"
              placeholder="Search events, concerts, venues, organizers..."
              className="w-full pl-10 py-1 focus:border-0 focus:outline-0"
            />
          </div>
          <div className="w-[20%] border-r border-gray-300 flex justify-center items-center">
            <label htmlFor="location" className="text-2xl">
              <IoLocationOutline />
            </label>
            <select className="pr-30 pl-1 text-gray-500 focus:outline-0">
              <option value="All Location">All Location</option>
            </select>
          </div>
          <div className="w-[20%] border-r border-gray-300 flex justify-center items-center">
            <label htmlFor="date">
              <ImCalendar />
            </label>
            <select
              className="pr-30 text-gray-500 pl-2 focus:outline-0 "
              name="date"
            >
              <option value="All Location">All Dates</option>
            </select>
          </div>
          <div className="w-[10%] flex justify-center items-center">
            <button className="bg-[#3f783d] text-white py-2 px-8 rounded-xl cursor-pointer hover:bg-[#284a26]">
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SearchLocation;
