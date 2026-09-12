import React from "react";
import { NavLink } from "react-router-dom";

const BookingCard = ({ hotel }) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-fit">
      <h3 className="text-2xl font-bold mb-2">Book This Venue</h3>

      <p className="text-xl font-bold text-[#F36B25] mb-6">
        From ₦{hotel.price.toLocaleString()}{" "}
        <span className="text-sm font-normal text-gray-500">/ night</span>
      </p>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Check Availability
          </label>

          <input
            type="date"
            className="w-full border border-gray-200 rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Check-in Date
          </label>

          <input
            type="date"
            className="w-full border border-gray-200 rounded-lg px-4 py-3"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600 block mb-2">
            Event Type
          </label>

          <select className="w-full border border-gray-200 rounded-lg px-4 py-3">
            <option>Select event type</option>
            <option>Wedding</option>
            <option>Conference</option>
            <option>Concert</option>
            <option>Birthday</option>
          </select>
        </div>

        <NavLink to={`/book-comfire/${hotel.id}`}>
          <button className="w-full bg-[#F36B25] hover:bg-[#dd5c17] text-white font-semibold py-3 rounded-lg">
            Request Booking
          </button>
        </NavLink>

        <button className="w-full border border-green-700 text-green-700 hover:bg-green-50 font-semibold py-3 rounded-lg mt-3">
          Send Enquiry
        </button>
      </div>
    </div>
  );
};

export default BookingCard;
