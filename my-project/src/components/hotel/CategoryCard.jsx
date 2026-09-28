import { Link } from "react-router-dom";
import React from "react";

const CategoryCard = ({ icon: Icon, title, count, color }) => {
  return (
    <Link to={`/search?category=Stay&q=${encodeURIComponent(title === "All Hotels" ? "" : title)}`} className="bg-white rounded-2xl border border-gray-200 h-40 flex flex-col justify-center items-center p-5 text-center hover:shadow-sm transition">
      <Icon className={`w-6 h-6 mx-auto mb-3 ${color}`} />
      <h3 className="font-semibold text-sm">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">{count} Hotels</p>
    </Link>
  );
};

export default CategoryCard;
