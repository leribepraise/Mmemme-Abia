import { Link } from "react-router-dom";
import React from "react";

const DealCard = () => {
  return (
    <div className="bg-[#1D5B2A] rounded-2xl p-5 text-white relative overflow-hidden">
      <span className="absolute right-3 top-3 bg-orange-500 text-xs px-2 py-1 rounded">
        %
      </span>

      <h3 className="font-bold text-lg mb-2">Explore Hotels</h3>

      <p className="text-sm text-green-100 mb-5">
        Browse hotels in Abia and check available rooms and prices.
      </p>

      <Link to="/search?category=Stay" className="bg-[#F36B25] hover:bg-[#dc5d19] px-5 py-2 rounded-lg font-semibold">
        View Hotels
      </Link>
    </div>
  );
};

export default DealCard;
