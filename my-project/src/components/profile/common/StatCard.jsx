import React from "react";
import { Link } from 'react-router-dom';

const StatCard = ({ icon, number, label, to }) => {
  const Wrapper = to ? Link : 'div';
  return (
    <Wrapper to={to} className="flex flex-col items-center justify-center rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF4EB] text-[#3F783D]">
        {icon}
      </div>

      <p className="text-xl font-bold text-[#172033]">{number}</p>

      <p className="text-[10px] text-gray-500">{label}</p>
    </Wrapper>
  );
};

export default StatCard;
