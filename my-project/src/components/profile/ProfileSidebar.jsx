import React from "react";

import {
  LayoutDashboard,
  Ticket,
  CalendarDays,
  Heart,
  CreditCard,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";

const ProfileSidebar = ({
  user,
  activeSection,
  mobileMenuOpen,
  onMenuClick,
  onLogout,
}) => {
  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "My Tickets",
      icon: Ticket,
    },
    {
      name: "My Bookings",
      icon: CalendarDays,
    },
    {
      name: "Saved Items",
      icon: Heart,
    },
    {
      name: "Payment History",
      icon: CreditCard,
    },
    {
      name: "Notifications",
      icon: Bell,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-[65px] z-40
        h-[calc(100vh-65px)]
        w-[260px]
        border-r border-gray-200
        bg-white
        transition-transform duration-300

        lg:sticky
        lg:top-0
        lg:h-screen
        lg:translate-x-0

        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex h-full flex-col">
        {/* PROFILE MINI CARD */}
        <div className="border-b border-gray-200 px-5 py-5 text-center">
          {/* PROFILE IMAGE */}
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border-2 border-gray-200 bg-[#EAF4EB]">
            {user.profilePicture  ? (
              <img
                src={user.profilePicture }
                alt={user.fullName || "User"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-lg font-bold text-[#3F783D]">
                {user.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
              </span>
            )}
          </div>

          {/* NAME */}
          <h2 className="text-sm font-bold text-[#172033]">
            {user.fullName || "User"}
          </h2>

          {/* VIEW PROFILE */}
          <button
            onClick={() => onMenuClick("Dashboard")}
            className="mt-1 text-[10px] text-[#3F783D] hover:underline"
          >
            View Profile
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive = activeSection === item.name;

            return (
              <button
                key={item.name}
                onClick={() => onMenuClick(item.name)}
                className={`
                  flex w-full items-center gap-3
                  rounded-lg px-3 py-2.5
                  text-left text-sm
                  transition

                  ${
                    isActive
                      ? "bg-[#267A26] text-white"
                      : "text-[#4B5563] hover:bg-[#F1F8F2]"
                  }
                `}
              >
                <Icon size={17} />

                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="border-t border-gray-200 px-4 py-4">
          <button
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={17} />

            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ProfileSidebar;
