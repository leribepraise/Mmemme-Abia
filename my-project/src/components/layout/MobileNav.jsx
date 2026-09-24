import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { IoSearch } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { navList, authLink, userNavList, profileLink } from "./NavList";
import { useAuth } from "../context/AuthContext"; // adjust path if needed
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { notifications } from "@/data/notifications";

const MobileNav = () => {
  const { isLoggedIn, user: account } = useAuth();
  const [open, setOpen] = useState(false);

  const user = account || {};

  const currentNav = isLoggedIn ? userNavList : navList;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const closeMenu = () => setOpen(false);

  return (
    <div className="z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="cursor-pointer p-2 rounded-md shadow-lg">
          <Menu />
        </SheetTrigger>

        <SheetContent>
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
              <SheetDescription>Mobile navigation</SheetDescription>
            </VisuallyHidden>
          </SheetHeader>

          <header className="px-6">
            {isLoggedIn && (
              <div className="flex items-center gap-5 mb-6 pb-4 border-b border-gray-200">
                <NavLink
                  to={profileLink.path}
                  onClick={closeMenu}
                  className="flex items-center gap-2"
                >
                  <img
                    src={user.profilePicture || "/user.png"}
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <span className="font-semibold text-sm">
                    {user.fullName || "My Profile"}
                  </span>
                </NavLink>

                <div className="flex items-center gap-4 ml-auto">
                  <span className="text-[20px] text-gray-600">
                    <IoSearch />
                  </span>

                  <NavLink to="/profile" onClick={closeMenu}>
                    <span className="relative text-[20px] text-gray-600">
                      <IoMdNotificationsOutline />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1.5 -right-2 flex items-center justify-center w-4 h-4 rounded-full bg-[#F97316] text-white text-[10px] font-bold">
                          {unreadCount}
                        </span>
                      )}
                    </span>
                  </NavLink>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-4 text-lg">
              {currentNav.map((n) => (
                <NavLink
                  key={n.title}
                  to={
                    isLoggedIn ? n.path : n.title === "Home" ? "/" : "/signup"
                  }
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    isActive ? "text-green-600 font-bold" : "font-normal"
                  }
                >
                  {n.title}
                </NavLink>
              ))}

              {!isLoggedIn && (
                <div className="flex gap-3 mt-4">
                  {authLink.map((link) => (
                    <NavLink
                      key={link.title}
                      to={link.path}
                      onClick={closeMenu}
                      className={`font-medium text-[18px] rounded-[10px] py-1 px-4 ${link.path === "/SignUp" ? "text-[#FFFEFE] bg-[#3F783D] border-2 border-[#3E753B]" : "bg-[#FDFCFD] text-[#3E753B] border-2 border-[#3E753B]"}`}
                    >
                      {link.title}
                    </NavLink>
                  ))}
                </div>
              )}
            </nav>
          </header>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
