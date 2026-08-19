import React from "react";
import { Calendar, Clock, MapPin, CalendarPlus } from "lucide-react";

const TicketCard = () => {
  return (
    <div className="relative bg-linear-to-r from-[#000000] to-[#666666] rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center md:items-stretch justify-between p-6 md:p-8 gap-8">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url('/checkout.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Ticket Details */}
      <div className="relative z-10 text-white flex-1 space-y-8 w-full">
        <h2 className="text-3xl font-bold leading-tight">
          Abia Business
          <br />
          Summit 2026
        </h2>

        <div className="space-y-3 text-sm font-medium text-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Fri, 25 Oct - Sun, 27 Oct, 2026</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>6:00 PM - 11:00 PM (WAT)</span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span className="leading-snug">
              Umueze Sports Arena, Umuahia,
              <br />
              Abia
            </span>
          </div>
        </div>

        <div className="flex items-center gap-12 pt-2">
          <div>
            <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">
              Ticket Type
            </p>
            <p className="font-bold text-lg">VIP</p>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">
              Quantity
            </p>
            <p className="font-bold text-lg">1</p>
          </div>
        </div>

        <div>
          <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">
            Order ID
          </p>
          <p className="font-bold text-lg tracking-wide">MBA-2026-9005-7856</p>
        </div>
      </div>

      {/* QR Code Pass */}
      <div className="relative z-10 w-full md:w-64 shrink-0 bg-white rounded-xl overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 flex flex-col items-center justify-center flex-1">
          <img
            src="/ticket.jpg"
            alt="QR Code"
            className="w-full h-auto aspect-square object-cover mb-4 rounded-md"
          />

          <p className="font-bold text-black text-sm tracking-wide text-center">
            MBA-2026-9005-7856
          </p>
        </div>

        <div className="bg-black text-white p-4 text-center">
          <p className="font-bold text-sm tracking-wide mb-2">
            MBA-2026-9005-7856
          </p>

          <button className="flex items-center justify-center gap-1.5 text-[#48782E] text-xs font-bold w-full mx-auto hover:text-green-400 transition-colors">
            <CalendarPlus className="w-3.5 h-3.5" />
            Add to Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
