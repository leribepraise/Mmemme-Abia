import React from "react";
import { Calendar, Clock, MapPin } from "lucide-react";

const EventSummaryCard = () => {
  return (
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

      {/* Vertical Divider */}
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
  );
};

export default EventSummaryCard;