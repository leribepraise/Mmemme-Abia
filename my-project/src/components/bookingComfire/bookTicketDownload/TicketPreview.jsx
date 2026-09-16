import React, { forwardRef } from "react";

const TicketPreview = forwardRef(({ hotel, bookingRef }, ref) => {
  return (
    <div
      ref={ref}
      className="bg-white w-[500px] p-6 rounded-xl border-2 border-dashed border-[#3F783D]"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg text-[#172033]">Mmemme Abia</h2>
        <span className="text-xs font-semibold text-[#3F783D]">
          BOOKING TICKET
        </span>
      </div>

      <div className="flex gap-3 mb-4">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-20 h-20 rounded-lg object-cover"
        />
        <div>
          <h3 className="font-bold text-base">{hotel.name}</h3>
          <p className="text-sm text-gray-500">{hotel.location}</p>
        </div>
      </div>

      <hr className="border-dashed border-gray-300 my-4" />

      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <span className="text-gray-500">Booking Reference</span>
        <span className="font-semibold text-right">{bookingRef}</span>

        <span className="text-gray-500">Check-in</span>
        <span className="font-semibold text-right">Sat, 24 May 2026</span>

        <span className="text-gray-500">Check-out</span>
        <span className="font-semibold text-right">Sun, 25 May 2026</span>

        <span className="text-gray-500">Guests</span>
        <span className="font-semibold text-right">1 Room, 2 Adults</span>
      </div>

      <hr className="border-dashed border-gray-300 my-4" />

      <p className="text-center text-xs text-gray-400">
        Present this ticket at check-in
      </p>
    </div>
  );
});

export default TicketPreview;
