import React from "react";
import { Check, Calendar, Clock, MapPin } from "lucide-react";

export default function PaymentSuccessfulScreen() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-400 mb-12 flex gap-2">
          <span>Events</span> &gt;
          <span>Abia Business Summit 2026</span> &gt;
          <span>Checkout</span> &gt;
          <span className="text-gray-300">Payment Successful</span>
        </div>

        {/* Main Success Content */}
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mt-8">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-[#48782E] rounded-full flex items-center justify-center mb-6 shadow-sm">
            <Check className="w-12 h-12 text-white" strokeWidth={4} />
          </div>

          <h1 className="text-3xl font-extrabold text-black mb-3 text-center">
            Payment Successful!
          </h1>

          <p className="text-gray-600 font-medium text-center text-sm md:text-base leading-relaxed mb-10 max-w-md">
            Your payment has been received and your tickets are confirmed.{" "}
            <br className="hidden md:block" />A confirmation email has been sent
            to you.
          </p>

          {/* Event & Order Summary Card */}
          <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col md:flex-row gap-6">
            {/* Left: Event Image */}
            <div className="w-full md:w-56 h-36 bg-gray-200 rounded-xl overflow-hidden shrink-0">
              <img
                src="/checkout.jpg"
                alt="Event Banner"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Middle: Event Details */}
            <div className="flex-1 flex flex-col justify-center space-y-3">
              <h3 className="font-bold text-base text-black">
                Abia Business Summit 2026
              </h3>

              <div className="space-y-2 text-sm font-medium text-gray-600">
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Fri, 25 Oct - Sun, 27 Oct, 2026</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>6:00 PM - 11:00 PM (WAT)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>Umueze Sports Arena, Umuahia, Abia</span>
                </div>
              </div>
            </div>

            {/* Vertical Divider (Hidden on Mobile) */}
            <div className="hidden md:block w-px bg-gray-100 my-2"></div>

            {/* Right: Order Info */}
            <div className="md:w-48 flex flex-col justify-center pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 space-y-4">
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">
                  Order ID
                </p>
                <p className="font-bold text-black text-sm">
                  MBA-2026-9005-7856
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-1">
                  Amount Paid
                </p>
                <p className="font-bold text-black text-base">N17,250</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
            <button className="bg-[#48782E] hover:bg-[#3a6125] text-white font-bold py-3 px-8 rounded-lg transition-colors text-sm shadow-sm">
              View My Ticket
            </button>
            <button className="bg-white border border-[#48782E] text-[#48782E] hover:bg-green-50 font-bold py-3 px-8 rounded-lg transition-colors text-sm shadow-sm">
              Download Ticket
            </button>
          </div>

          {/* Back to Home Link */}
          <button className="mt-8 text-[#48782E] font-bold text-sm hover:underline">
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
