import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/componentss/ui/sheet";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import { navList } from "./NavList";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const MobileNav = () => {
  return (
    <div className="z-50">
      <Sheet>
        <SheetTrigger className="cursor-pointer p-2 rounded-md shadow-lg">
          <Menu />
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <SheetDescription>This action cannot be undone.</SheetDescription>
            </VisuallyHidden>
          </SheetHeader>
          <header className="px-6">
            <nav className="flex flex-col gap-4 text-lg">
              {navList.map((n) => (
                <NavLink
                  key={n.title}
                  to={n.path}
                  className={({ isActive }) =>
                    `${isActive ? "text-green-600 font-bold" : "font-normal"}`
                  }
                >
                  {n.title}
                </NavLink>
              ))}
            </nav>
          </header>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNav;
