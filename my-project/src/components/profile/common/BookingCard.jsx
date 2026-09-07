import React from "react";
import { MapPin } from "lucide-react";

const BookingCard = ({ image, title, location, status, price }) => {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      {/* IMAGE */}
      <div className="h-32 overflow-hidden bg-gray-100">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>

      {/* CONTENT */}
      <div className="p-3">
        <h3 className="text-xs font-bold text-[#172033]">{title}</h3>

        <p className="mt-1 flex items-center gap-1 text-[9px] text-gray-500">
          <MapPin size={9} />
          {location}
        </p>

        <div className="mt-3 flex items-center justify-between">
          <span
            className={`
              rounded px-2 py-1 text-[8px]

              ${
                status === "Confirmed"
                  ? "bg-green-50 text-green-600"
                  : "bg-orange-50 text-orange-500"
              }
            `}
          >
            {status}
          </span>

          <span className="text-xs font-bold">{price}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
