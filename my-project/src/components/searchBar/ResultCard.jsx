import React from "react";
import { NavLink } from "react-router-dom";
import { MapPin, Star, Calendar } from "lucide-react";

const ResultCard = ({ result }) => {
  const isEvent = result.type === "event";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4">
      <div className="relative w-full sm:w-40 h-32 shrink-0 rounded-lg overflow-hidden">
        <img
          src={result.image}
          alt={result.name}
          className="w-full h-full object-cover"
        />

        {isEvent && (
          <span className="absolute top-2 left-2 bg-[#F97316] text-white text-[10px] font-bold px-2 py-1 rounded">
            TOUR
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-base text-[#172033]">{result.name}</h3>

        {isEvent ? (
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{result.date}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{result.location}</span>
          </div>
        )}

        {isEvent ? (
          <p className="text-sm text-gray-500 mt-1">{result.categoryLabel}</p>
        ) : (
          result.rating && (
            <div className="flex items-center gap-1 text-sm mt-1">
              <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span className="font-semibold">{result.rating}</span>
              <span className="text-gray-400">({result.reviews} reviews)</span>
              <span className="text-gray-400">• {result.categoryLabel}</span>
            </div>
          )
        )}

        {result.description && (
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            {result.description}
          </p>
        )}

        {isEvent ? (
          <>
            <hr className="border-gray-100 my-3" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">From</p>
                <p className="font-bold text-lg text-[#172033]">
                  {result.price === 0
                    ? "Free"
                    : `₦${result.price.toLocaleString()}`}
                </p>
              </div>

              <NavLink to={result.to}>
                <button className="bg-[#3F783D] hover:bg-[#356433] text-white font-semibold text-sm px-5 py-2 rounded-lg transition">
                  Book Event
                </button>
              </NavLink>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-between mt-3">
            {result.price === 0 ? (
              <span className="bg-[#EAF4EB] text-[#3F783D] text-xs font-semibold px-3 py-1 rounded-full">
                Free Entry
              </span>
            ) : (
              <span className="font-bold text-[#172033]">
                From ₦{result.price.toLocaleString()}
              </span>
            )}

            <NavLink to={result.to}>
              <button className="border border-[#3F783D] text-[#3F783D] hover:bg-[#EAF4EB] font-semibold text-sm px-5 py-2 rounded-lg transition">
                View Details
              </button>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
