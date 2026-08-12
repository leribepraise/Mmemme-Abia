import React from "react";
import { navList } from "./NavList";
import { IoSearch } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { NavLink } from "react-router-dom";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <>
      <div className="mx-5 pt-3">
        <nav className="hidden lg:flex justify-between items-center gap-5 bg-white shadow-md p-5 rounded-lg">
          <img src="/logo.png" alt="" className="w-auto h-10" />
          {navList.map((n) => (
            <NavLink
              key={n.title}
              to={n.path}
              className={`className="list-none flex gap-5 font-semibold text-[14px]`}
            >
              {n.title}
            </NavLink>
          ))}
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
            <button className="bg-[#3f783d] text-[#ffffff] py-1 px-4 rounded-md font-medium text-lg">
              Sign up
            </button>
          </div>
        </nav>
        <div className="lg:hidden z-1000">
          <div className="flex justify-between">
            <img src="/logo.png" alt="" className="w-auto h-10" />
            <MobileNav />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
