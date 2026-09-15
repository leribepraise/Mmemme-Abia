import React from "react";
import { MapPin, Clock, Ticket, Calendar } from "lucide-react";

const TourDestinationInfo = ({ tour }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[#172033]">{tour.name}</h1>

      <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
        <MapPin className="w-4 h-4" />
        <span>{tour.location}</span>
      </div>

      <p className="text-gray-600 mt-4 leading-relaxed">{tour.description}</p>

      <div className="flex flex-wrap gap-8 mt-6">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Open Daily</p>
            <p className="text-sm font-semibold text-[#172033]">
              {tour.openHours}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Ticket className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Ticket Price</p>
            <p className="text-sm font-semibold text-[#172033]">
              {tour.ticketPrice}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <div>
            <p className="text-xs text-gray-400">Best Time to Visit</p>
            <p className="text-sm font-semibold text-[#172033]">
              {tour.bestTimeToVisit}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button className="bg-[#F97316] hover:bg-[#df5f18] text-white font-semibold px-6 py-2.5 rounded-lg transition">
          Plan Your Visit
        </button>
        <button className="border border-gray-300 text-[#172033] font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition">
          View Gallery
        </button>
      </div>

      <hr className="border-gray-200 my-6" />

      <div>
        <h2 className="font-bold text-lg text-[#172033] mb-2">
          About This Destination
        </h2>
        <p className="text-gray-600 leading-relaxed">{tour.aboutText}</p>
      </div>

      <hr className="border-gray-200 my-6" />

      <div>
        <h2 className="font-bold text-lg text-[#172033] mb-3">Facilities</h2>
        <div className="flex flex-wrap gap-3">
          {tour.facilities?.map((facility) => (
            <span
              key={facility}
              className="bg-gray-100 text-gray-600 text-sm px-3 py-1.5 rounded-full"
            >
              {facility}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourDestinationInfo;
