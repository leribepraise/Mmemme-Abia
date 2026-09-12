import React from "react";
import { NavLink } from "react-router-dom";

const BookingAlert = ({ hotel }) => {
  const bookingRef = hotel
    ? `MMA${hotel.id.slice(0, 4).toUpperCase()}${Date.now().toString().slice(-4)}`
    : "MMA2505267890";

  return (
    <div className="space-y-5 max-w-2xl">
      <img src="/Background.png" />
      <div className="space-y-5">
        <h1 className="font-bold text-[#191C1D] text-[32px]">
          Booking Confirmed!
        </h1>
        <p className="text-[16px] text-[#41493E] font-normal">
          Your booking has been confirmed successfully.
        </p>
      </div>
      <div className="rounded-[12px] border-2 border-[#C1C9BB] bg-[#F3F4F5] max-w-80 py-5 pl-5">
        <p className="font-medium text-[12px] text-[#41493E] flex">
          BOOKING REFERENCE
        </p>
        <p className="font-semibold text-[20px] text-[#191C1D]">{bookingRef}</p>
      </div>
      <p className="text-[14px] text-[#41493E] font-normal">
        We have sent the booking details to
        <br /> chioma.okafor@gmail.com and +234 813 245 6789
      </p>
      <div className="flex gap-3">
        <NavLink to="/my-bookings">
          <button className="bg-[#FC6C2B] rounded-[8px] px-5 py-2 text-white">
            View My Bookings
          </button>
        </NavLink>
        <NavLink to="/">
          <button className="border-2 border-[#3F783D] rounded-[8px] px-5 py-2 text-[#3F783D]">
            Back to Home
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default BookingAlert;
