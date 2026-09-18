import React from "react";
import { NavLink } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";

const BookingAlert = ({ hotel, bookingRef }) => {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Banner / Success Hero Image */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#265F27]/10 to-[#F97316]/10 p-2 text-center">
        <img
          src="/Background.png"
          alt="Booking confirmed banner"
          className="h-48 w-full rounded-xl object-cover md:h-56"
        />
      </div>

      {/* Confirmation Title & Message */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-[#265F27]" />
          <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
            Booking Confirmed!
          </h1>
        </div>

        <p className="text-base font-medium text-gray-600 md:text-lg">
          Your reservation has been confirmed successfully.
        </p>
      </div>

      {/* Reference Number Card */}
      <div className="max-w-xs rounded-2xl border-2 border-gray-200 bg-gray-50 p-5 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Booking Reference
        </p>
        <p className="mt-1 text-2xl font-extrabold tracking-wide text-gray-900">
          {bookingRef}
        </p>
      </div>

      {/* Confirmation Notice */}
      <p className="text-sm font-semibold text-gray-600 md:text-base">
        We have sent the confirmation details to:
        <br />
        <span className="font-bold text-gray-900">chioma.okafor@gmail.com</span>{" "}
        &amp;{" "}
        <span className="font-bold text-gray-900">+234 813 245 6789</span>
      </p>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <NavLink to="/my-bookings" className="w-full sm:w-auto">
          <button className="w-full cursor-pointer rounded-xl bg-[#F97316] px-6 py-3.5 text-sm font-extrabold text-white shadow-md transition hover:bg-[#ea580c] md:text-base">
            View My Bookings
          </button>
        </NavLink>

        <NavLink to="/" className="w-full sm:w-auto">
          <button className="w-full cursor-pointer rounded-xl border-2 border-[#265F27] bg-transparent px-6 py-3.5 text-sm font-bold text-[#265F27] transition hover:bg-[#265F27] hover:text-white md:text-base">
            Back to Home
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default BookingAlert;