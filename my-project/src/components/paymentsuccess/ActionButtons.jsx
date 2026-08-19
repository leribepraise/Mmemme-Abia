import React from "react";
import { NavLink } from "react-router-dom";

const ActionButtons = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
        <NavLink to="/ticket">
          <button className="bg-[#48782E] hover:bg-[#3a6125] text-white font-bold py-3 px-8 rounded-lg transition-colors text-sm shadow-sm">
            View My Ticket
          </button>
        </NavLink>                 

        <button className="bg-white border border-[#48782E] text-[#48782E] hover:bg-green-50 font-bold py-3 px-8 rounded-lg transition-colors text-sm shadow-sm">
          Download Ticket
        </button>
      </div>

      <button className="mt-8 text-[#48782E] font-bold text-sm hover:underline">
        Back to Home
      </button>
    </>
  );
};

export default ActionButtons;
