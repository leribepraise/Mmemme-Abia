import React from "react";
import { NavLink } from "react-router-dom";

const NotFoundButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-7">
      <NavLink
        to="/"
        className="bg-[#FF5A00] hover:bg-[#e94f00] text-white font-semibold text-sm px-7 py-3 rounded-lg text-center transition"
      >
        Go Home
      </NavLink>

      <NavLink
        to="/events"
        className="bg-white border-2 border-[#2F713E] text-[#2F713E] hover:bg-green-50 font-semibold text-sm px-7 py-3 rounded-lg text-center transition"
      >
        Explore Events
      </NavLink>
    </div>
  );
};

export default NotFoundButtons;
