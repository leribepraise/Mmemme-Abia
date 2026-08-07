import React from "react";
import { IoSearch } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";

const Header = () => {
  return (
    <>
      <div className="mx-5 pt-3">
        <nav className="flex justify-between items-center gap-5 bg-white shadow-md p-5 rounded-lg">
          <img src="/logo.png" alt="" className="w-auto h-10" />
          <ul className="list-none flex gap-5 font-normal text-lg">
            <li>Home</li>
            <li>Events</li>
            <li>Categories</li>
            <li>Venues</li>
            <li>About Abia</li>
            <li>Blog</li>
          </ul>
          <div className="flex gap-5 items-center">
            <span className="text-[20px]">
              <IoSearch />
            </span>
            <span className="text-[20px]">
              <IoMdNotificationsOutline />
            </span>
            <button className="border-2 border-[#3f783d] text-[#3f783d] py-1 px-4 rounded-md font-medium text-lg">
              Login
            </button>
            <button className="bg-[#3f783d] text-[#fff] py-1 px-4 rounded-md font-medium text-lg">
              Sign up
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
