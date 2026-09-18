import React from "react";
import { navList, authLink, userNavList, profileLink } from "./NavList";
import { IoSearch } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { NavLink, useNavigate } from "react-router-dom";
import MobileNav from "./MobileNav";
import { useAuth } from "@/components/context/AuthContext";

const Header = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  
  const user = (() => {
    try {
      const item = sessionStorage.getItem("user");
      return item ? JSON.parse(item) : {};
    } catch (e) {
      return {};
    }
  })();

  const currentNav = isLoggedIn ? userNavList : navList;

  // Handle protected route clicks for non-logged-in users
  const handleNavClick = (e, path, title) => {
    // Allow Home and Public pages if desired, or gate specific ones
    const publicPages = ["Home", "About us", "Blog"];
    
    if (!isLoggedIn && !publicPages.includes(title)) {
      e.preventDefault();
      // Redirect to signup/login or prompt user
      navigate("/signup"); 
    }
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full">
      {/* Full-width container extending from left to right */}
      <div className="w-full bg-white shadow-sm border-b border-gray-100/50 rounded-b-3xl lg:rounded-bl-[36px] lg:rounded-br-none px-6 md:px-12 py-3.5 flex justify-between items-center">
        
        {/* Brand Logo - Fixed on the left edge */}
        <NavLink to="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="Mmemme Abia Logo" className="h-8 md:h-9 w-auto object-contain" />
        </NavLink>

        {/* Desktop Navigation - Centered / Spaced */}
        <nav className="hidden lg:flex items-center gap-8">
          {currentNav.map((n) => (
            <NavLink
              key={n.title}
              to={n.path}
              onClick={(e) => handleNavClick(e, n.path, n.title)}
              className={({ isActive }) =>
                `text-[14px] font-bold transition-colors ${
                  isActive
                    ? "text-[#FD6C11] underline decoration-[#FD6C11] underline-offset-4"
                    : "text-gray-700 hover:text-black"
                }`
              }
            >
              {n.title}
            </NavLink>
          ))}
        </nav>

        {/* Right Action Items (Search, Notifications, Profile / Auth Buttons) */}
        <div className="hidden lg:flex items-center gap-5">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <button className="text-gray-600 hover:text-black text-xl transition-colors" aria-label="Search">
                <IoSearch />
              </button>
              <button className="text-gray-600 hover:text-black text-2xl relative transition-colors" aria-label="Notifications">
                <IoMdNotificationsOutline />
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#F36B25] rounded-full ring-2 ring-white" />
              </button>
              <NavLink to={profileLink.path} className="ml-1">
                <img
                  src={user.profilePicture || "/user.png"}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#3F7D3D]/20 hover:ring-[#3F7D3D] transition-all"
                />
              </NavLink>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {authLink.map((link) => (
                <NavLink
                  key={link.title}
                  to={link.path}
                  className={`text-sm font-bold rounded-xl py-2 px-5 transition-all ${
                    link.path === "/SignUp"
                      ? "text-white bg-[#3F7D3D] hover:bg-[#336633] shadow-sm"
                      : "text-[#3F7D3D] bg-gray-50 hover:bg-gray-100 border border-[#3F7D3D]/30"
                  }`}
                >
                  {link.title}
                </NavLink>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Nav Toggle Button */}
        <div className="lg:hidden flex items-center">
          <MobileNav />
        </div>

      </div>
    </header>
  );
};

export default Header;