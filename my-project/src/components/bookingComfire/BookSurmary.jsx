import React from "react";

const BookingSummary = ({ hotel = {} }) => {
  const roomCharges = hotel?.price || 0;
  const serviceFee = 3000;
  const taxes = 2000;
  const total = roomCharges + serviceFee + taxes;

  return (
    <div className="w-full max-w-md rounded-2xl border-2 border-gray-200 bg-[#F8F9FA] p-6 shadow-sm">
      {/* CARD TITLE */}
      <h2 className="text-xl font-extrabold text-gray-900 md:text-2xl">
        Booking Summary
      </h2>

      <hr className="my-4 border-gray-200" />

      {/* HOTEL DETAILS */}
      <div className="mb-6 flex items-start gap-4">
        <img
          src={hotel?.image || "/placeholder.png"}
          alt={hotel?.name || "Hotel image"}
          className="h-20 w-20 flex-shrink-0 rounded-xl object-cover shadow-xs"
        />
        <div className="space-y-1">
          <h3 className="text-base font-extrabold text-gray-900 md:text-lg">
            {hotel?.name || "Hotel Name"}
          </h3>
          <p className="text-sm font-semibold text-gray-600">
            Sat, 24 May 2026 – Sun, 25 May 2026
          </p>
          <p className="text-sm font-medium text-gray-500">
            1 Room, 2 Adults
          </p>
        </div>
      </div>

      {/* COST BREAKDOWN */}
      <div className="space-y-3 text-sm md:text-base">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Room Charges</span>
          <span className="font-extrabold text-gray-900">
            ₦{roomCharges.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Service Fee</span>
          <span className="font-extrabold text-gray-900">
            ₦{serviceFee.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Taxes &amp; Charges</span>
          <span className="font-extrabold text-gray-900">
            ₦{taxes.toLocaleString()}
          </span>
        </div>
      </div>

      <hr className="my-5 border-dashed border-gray-300" />

      {/* TOTAL COST */}
      <div className="flex items-center justify-between pt-1">
        <span className="text-lg font-bold text-gray-900 md:text-xl">
          Total Paid
        </span>
        <span className="text-2xl font-black text-[#265F27] md:text-3xl">
          ₦{total.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default BookingSummary;