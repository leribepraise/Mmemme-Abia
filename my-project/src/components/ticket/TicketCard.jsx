import toast from 'react-hot-toast';
import TicketQRCode from "../profile/common/qrCodeFolder/TicketQRCode";
import React from "react";
import { Calendar, Clock, MapPin, CalendarPlus } from "lucide-react";

const TicketCard = ({ booking, ticket }) => {
  const totalTickets = 1;

  return (
    <div className="relative bg-linear-to-r from-[#000000] to-[#666666] rounded-2xl shadow-lg overflow-hidden flex flex-col md:flex-row items-center md:items-stretch justify-between p-6 md:p-8 gap-8">
      {/* Background Image Overlay */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('${booking?.image || "/checkout.jpg"}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/* Ticket Details */}
      <div className="relative z-10 text-white flex-1 space-y-8 w-full">
        <h2 className="text-3xl font-bold leading-tight">
          {booking?.title || "Event"}
        </h2>

        <div className="space-y-3 text-sm font-medium text-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{booking.event_date || "See event details"}</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{ticket.status}</span>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span className="leading-snug">
              {booking?.location || "Location unavailable"}
            </span>
          </div>
        </div>

        {/* Attendee Information */}
        <div className="space-y-3">
          <div>
            <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">
              Attendee
            </p>

            <p className="font-bold text-lg">
              {booking?.customer_name || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">
              Email
            </p>

            <p className="font-semibold text-sm break-all text-gray-200">
              {booking?.attendee?.email || "Not provided"}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">
              Booking For
            </p>

            <p className="font-bold text-base">
              {booking?.details?.booking_for_someone_else
                ? "Someone else"
                : "Myself"}
            </p>
          </div>
        </div>

        {/* Ticket Information */}
        <div className="flex items-center gap-12 pt-2">
          <div>
            <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">
              Ticket Type
            </p>

            <p className="font-bold text-lg">
              {booking.items.find(item => item.ticket_type === ticket.ticket_type)?.description || 'Admission'}
            </p>
          </div>

          <div>
            <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">
              Quantity
            </p>

            <p className="font-bold text-lg">{totalTickets}</p>
          </div>
        </div>

        {/* Order ID */}
        <div>
          <p className="text-[10px] text-gray-400 font-semibold mb-1 uppercase tracking-wider">
            Order ID
          </p>

          <p className="font-bold text-lg tracking-wide">
            {ticket.ticket_number}
          </p>
        </div>
      </div>

      {/* QR Code Pass */}
      <div className="relative z-10 w-full md:w-64 shrink-0 bg-white rounded-xl overflow-hidden flex flex-col shadow-2xl">
        <div className="p-4 flex flex-col items-center justify-center flex-1">
          <TicketQRCode value={ticket.qr_code} size={220} />

          <p className="font-bold text-black text-sm tracking-wide text-center">
            {ticket.ticket_number}
          </p>
        </div>

        <div className="bg-black text-white p-4 text-center">
          <p className="font-bold text-sm tracking-wide mb-2">
            {ticket.ticket_number}
          </p>

          <button onClick={() => toast("Wallet passes are not available yet.")} className="flex items-center justify-center gap-1.5 text-[#48782E] text-xs font-bold w-full mx-auto hover:text-green-400 transition-colors">
            <CalendarPlus className="w-3.5 h-3.5" />
            Add to Wallet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TicketCard;
