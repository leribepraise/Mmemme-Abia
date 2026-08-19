import React from "react";
import { navList } from "./NavList";
import { authLink } from "./NavList";
import { userNavList } from "./NavList";
import { profileLink } from "./NavList";
import { IoSearch } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { NavLink } from "react-router-dom";
import MobileNav from "./MobileNav";
import { Underline } from "lucide-react";
import { useAuth } from "@/components/context/AuthContext";

const Header = () => {
  // const isLoggedIn = false;
  const { isLoggedIn } = useAuth();

  const currentNav = isLoggedIn ? userNavList : navList;
  return (
    <>
      <div className="mx-5 pt-3">
        <nav className="hidden lg:flex justify-between items-center gap-5 bg-white shadow-md p-5 rounded-lg">
          <img src="/logo.png" alt="" className="w-auto h-10" />
          {/* {navList.map((n) => (
            <NavLink
              key={n.title}
              to={n.path}
              className={({ isActive }) =>
                `list-none flex gap-5 font-semibold text-[14px] ${
                  isActive
                    ? "text-[#FD6C11] underline decoration-[#FD6C11]"
                    : "text-gray-600"
                }`
              }
            >
              {n.title}
            </NavLink>
          ))} */}

          {currentNav.map((n) => (
            <NavLink
              key={n.title}
              to={isLoggedIn ? n.path : n.title === "Home" ? "/" : "/signup"}
              className={({ isActive }) =>
                `list-none flex gap-5 font-semibold text-[14px] ${
                  isActive
                    ? "text-[#FD6C11] underline decoration-[#FD6C11]"
                    : "text-gray-600"
                }`
              }
            >
              {n.title}
            </NavLink>
          ))}
          <div className="flex gap-5 items-center">
            {isLoggedIn  && (
              <div className="flex gap-3">
                <span className="text-[20px]">
                  <IoSearch />
                </span>

                <span className="text-[20px]">
                  <IoMdNotificationsOutline />
                </span>
              </div>
            )}
            <nav className="hidden lg:flex justify-between items-center gap-5 ">
              {/* {authLink.map((link) => (
                <NavLink
                  key={link.title}
                  to={link.path}
                  className={`font-medium text-[18px] rounded-[10px] py-1 px-4 ${link.path === "/SignUp" ? "text-[#FFFEFE] bg-[#3F783D] border-2 border-[#3E753B]" : "bg-[#FDFCFD] text-[#3E753B] border-2 border-[#3E753B]"}`}
                >
                  {link.title}
                </NavLink>
              ))} */}

              {isLoggedIn ? (
                <NavLink to={profileLink.path}>
                  <div className="flex items-center gap-2">
                    <img
                      src="/user.png"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    {/* <span className="font-semibold">{profileLink.title}</span> */}
                  </div>
                </NavLink>
              ) : (
                <div className="flex gap-3">
                  {authLink.map((link) => (
                    <NavLink
                      key={link.title}
                      to={link.path}
                      className={`font-medium text-[18px] rounded-[10px] py-1 px-4 ${link.path === "/SignUp" ? "text-[#FFFEFE] bg-[#3F783D] border-2 border-[#3E753B]" : "bg-[#FDFCFD] text-[#3E753B] border-2 border-[#3E753B]"}`}
                    >
                      {link.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </nav>
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
