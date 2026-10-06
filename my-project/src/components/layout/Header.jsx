import React from "react";
import { navList } from "./NavList";
import { authLink } from "./NavList";
import { userNavList } from "./NavList";
import { profileLink } from "./NavList";
import { IoSearch } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { NavLink } from "react-router-dom";
import MobileNav from "./MobileNav";
import ThemeToggle from '../ThemeToggle';
import { useAuth } from "@/components/context/AuthContext";
import { useNotifications } from '@/components/context/NotificationsContext';

const Header = () => {
  const { isLoggedIn, user: account } = useAuth();

  const user = account || {};

  const currentNav = isLoggedIn ? userNavList : navList;

  const { unreadCount } = useNotifications();

  return (
    <>
      {/* Spacer so page content doesn't sit underneath the fixed header */}
      <div className="h-[88px] lg:h-[96px]" />

      <div className="fixed top-0 left-0 right-0 z-50 mx-5 pt-3">
        <nav className="hidden lg:flex justify-between items-center gap-5 bg-white shadow-md p-5 rounded-lg">
          <NavLink to="/" aria-label="Mmemme Abia home"><img src="/logo.png" alt="" className="w-auto h-10" /></NavLink>

          {currentNav.map((n) => (
            <NavLink
              key={n.title}
              to={n.path}
              reloadDocument={n.path === '/blog'}
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
            <ThemeToggle compact/>
            {isLoggedIn && (
              <div className="flex gap-3">
                <NavLink to="/search" aria-label="Search">
                  <span className="text-[20px]">
                    <IoSearch />
                  </span>
                </NavLink>

                <NavLink to="/notifications" aria-label={`Notifications, ${unreadCount} unread`}>
                  <span className="relative text-[20px]">
                    <IoMdNotificationsOutline />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex items-center justify-center w-4 h-4 rounded-full bg-[#F97316] text-white text-[10px] font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </span>
                </NavLink>
              </div>
            )}

            <nav className="hidden lg:flex justify-between items-center gap-5">
              {isLoggedIn ? (
                <NavLink to={profileLink.path}>
                  <div className="flex items-center justify-center">
                    <div className="h-7 w-7 overflow-hidden rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.fullName || "User profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-[#3F783D]">
                          {user.fullName
                            ? user.fullName.charAt(0).toUpperCase()
                            : "U"}
                        </span>
                      )}
                    </div>
                  </div>
                </NavLink>
              ) : (
                <div className="flex gap-3">
                  {authLink.map((link) => (
                    <NavLink
                      key={link.title}
                      to={link.path}
                      className={`font-medium text-[18px] rounded-[10px] py-1 px-4 ${
                        link.path === "/SignUp"
                          ? "text-[#FFFEFE] bg-[#3F783D] border-2 border-[#3E753B]"
                          : "bg-[#FDFCFD] text-[#3E753B] border-2 border-[#3E753B]"
                      }`}
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
          <div className="flex justify-between bg-white shadow-md p-4 rounded-lg">
            <NavLink to="/" aria-label="Mmemme Abia home"><img src="/logo.png" alt="" className="w-auto h-10" /></NavLink>
            <div className="flex items-center gap-2"><ThemeToggle compact/><MobileNav /></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
