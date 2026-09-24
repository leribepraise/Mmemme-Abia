import React, { forwardRef } from "react";
import TicketQRCode from "../../profile/common/qrCodeFolder/TicketQRCode";

const TicketPreview = forwardRef(({ hotel, bookingRef, booking }, ref) => {
  return (
    <div
      ref={ref}
      className="w-[600px] rounded-2xl border-2 border-dashed border-[#265F27] bg-white p-8 shadow-sm"
    >
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
        <h2 className="text-2xl font-extrabold text-gray-900">Mmemme Abia</h2>
        <span className="rounded-lg bg-[#265F27]/10 px-3 py-1.5 text-xs font-black tracking-widest text-[#265F27]">
          BOOKING TICKET
        </span>
      </div>

      {/* HOTEL DETAILS */}
      <div className="mb-6 flex items-center gap-4">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="h-24 w-24 rounded-xl object-cover shadow-sm"
        />
        <div>
          <h3 className="text-xl font-extrabold text-gray-900">{hotel.name}</h3>
          <p className="mt-1 text-base font-semibold text-gray-500">
            {hotel.location}
          </p>
        </div>
      </div>

      <hr className="my-6 border-dashed border-gray-300" />

      {/* TICKET DATA GRID */}
      <div className="grid grid-cols-2 gap-y-3.5 text-base">
        <span className="font-semibold text-gray-500">Booking Reference</span>
        <span className="font-extrabold text-right text-gray-900">
          {bookingRef}
        </span>

        <span className="font-semibold text-gray-500">Check-in</span>
        <span className="font-extrabold text-right text-gray-900">
          {booking.details.check_in}
        </span>

        <span className="font-semibold text-gray-500">Check-out</span>
        <span className="font-extrabold text-right text-gray-900">
          {booking.details.check_out}
        </span>

        <span className="font-semibold text-gray-500">Guests</span>
        <span className="font-extrabold text-right text-gray-900">
          {booking.details.rooms} Room(s), {booking.details.guests || 1} Guest(s)
        </span>
      </div>

      <hr className="my-6 border-dashed border-gray-300" />

      {/* QR CODE + FOOTER */}
      <div className="flex flex-col items-center gap-3">
        <TicketQRCode value={bookingRef} size={110} />

        <p className="text-center text-sm font-bold tracking-wide text-gray-400 uppercase">
          Present this ticket at check-in
        </p>
      </div>
    </div>
  );
});

export default TicketPreview;
