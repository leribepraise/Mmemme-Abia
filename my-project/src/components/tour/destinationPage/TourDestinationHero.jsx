import React from "react";
import { Star } from "lucide-react";

const TourDestinationHero = ({ tour }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden">
      <img
        src={tour.image}
        alt={tour.name}
        className="w-full max-h-96 object-contain bg-gray-100"
      />

      <div className="absolute bottom-4 left-4 bg-black/60 text-white text-sm font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1">
        <Star className="w-4 h-4 text-orange-400 fill-orange-400" />
        {tour.rating} ({tour.reviews} reviews)
      </div>

    </div>
  );
};

export default TourDestinationHero;
