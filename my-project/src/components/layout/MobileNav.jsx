import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/componentss/ui/sheet";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { navList, authLink, userNavList, profileLink } from "./NavList";
import { useAuth } from "../context/AuthContext"; // adjust path if needed
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const MobileNav = () => {
  const { isLoggedIn } = useAuth();

  const currentNav = isLoggedIn ? userNavList : navList;

  return (
    <div className="z-50">
      <Sheet>
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
            <nav className="flex flex-col gap-4 text-lg">
              {currentNav.map((n) => (
                <NavLink
                  key={n.title}
                  to={
                    isLoggedIn ? n.path : n.title === "Home" ? "/" : "/signup"
                  }
                  className={({ isActive }) =>
                    isActive ? "text-green-600 font-bold" : "font-normal"
                  }
                >
                  {n.title}
                </NavLink>
              ))}

              {isLoggedIn ? (
                <NavLink
                  to={profileLink.path}
                  className="flex items-center gap-3 mt-4"
                >
                  <img
                    src="/user.png"
                    alt="Profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                </NavLink>
              ) : (
                <div className="flex gap-3 mt-4">
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
          </header>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
