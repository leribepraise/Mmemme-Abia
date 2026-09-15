import React from "react";
import { Star, Heart } from "lucide-react";

const TourDestinationHero = ({ tour }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <img
        src={tour.image}
        alt={tour.name}
        className="w-full h-72 md:h-96 object-cover"
      />

      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
        <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
        {tour.rating} ({tour.reviews} reviews)
      </div>

      <button className="absolute bottom-4 right-4 bg-white text-[#172033] text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition">
        <Heart className="w-4 h-4" />
        Add to Wishlist
      </button>
    </div>
  );
};

export default TourDestinationHero;
