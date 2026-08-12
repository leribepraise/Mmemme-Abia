import React from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  CalendarPlus,
  Share2,
  HelpCircle,
  Phone,
  Mail,
  AlertTriangle,
} from "lucide-react";

export default function TicketScreen() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-400 mb-8 flex gap-2 flex-wrap">
          <span>Events</span> &gt;
          <span>Abia Business Summit 2026</span> &gt;
          <span>Checkout</span> &gt;
          <span>Payment Successful</span> &gt;
          <span className="text-gray-600">Your Ticket</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-black">
            Your Ticket
          </h1>
          <p className="text-gray-600 font-medium">
            Present this QR code at the venue entrance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT COLUMN: Ticket Card & Notes */}
          <div className="lg:col-span-8 space-y-6">
            {/* Dark Ticket Card */}
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

              {/* Ticket Details (Left Side) */}
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
                  <p className="font-bold text-lg tracking-wide">
                    MBA-2026-9005-7856
                  </p>
                </div>
              </div>

              {/* QR Code Pass (Right Side) */}
              <div className="relative z-10 w-full md:w-64 shrink-0 bg-white rounded-xl overflow-hidden flex flex-col shadow-2xl">
                {/* Top White Section */}
                <div className="p-4 flex flex-col items-center justify-center flex-1">
                  {/* Fake QR Code image */}
                  <img
                    src="/ticket.jpg"
                    alt="QR Code"
                    className="w-full h-auto aspect-square object-cover mb-4 rounded-md"
                  />
                  <p className="font-bold text-black text-sm tracking-wide text-center">
                    MBA-2026-9005-7856
                  </p>
                </div>

                {/* Bottom Dark Section */}
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

            {/* Important Notes Alert */}
            <div className="bg-[#FFF8F6] border border-[#FFE8E3] rounded-2xl p-6">
              <div className="flex items-center gap-2 text-[#F36B25] mb-4">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-base">Important Notes</h3>
              </div>
              <ul className="space-y-3 text-sm font-bold text-gray-700">
                <li className="flex gap-3">
                  <span className="text-[#F36B25]">•</span>
                  Show this QR code at the entrance for verification.
                </li>
                <li className="flex gap-3">
                  <span className="text-[#F36B25]">•</span>
                  This ticket is non-transferable and non-refundable.
                </li>
                <li className="flex gap-3">
                  <span className="text-[#F36B25]">•</span>
                  Please arrive early to avoid delays.
                </li>
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN: Actions & Support */}
          <div className="lg:col-span-4 space-y-6">
            {/* Action Buttons */}
            <div className="space-y-4">
              <button className="w-full bg-[#F36B25] hover:bg-[#d95d1d] text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                <Download className="w-5 h-5" />
                Download Ticket
              </button>

              <button className="w-full bg-white border border-[#48782E] text-[#48782E] hover:bg-green-50 font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                <CalendarPlus className="w-5 h-5" />
                Add to Wallet
              </button>

              <button className="w-full bg-white border border-[#48782E] text-[#48782E] hover:bg-green-50 font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
                <Share2 className="w-5 h-5" />
                Share Ticket
              </button>
            </div>

            {/* Need Help Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-green-50 p-3 rounded-xl text-[#48782E]">
                  <HelpCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-black text-lg">Need Help?</h4>
                  <p className="text-sm text-gray-500 font-medium">
                    Contact support
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-sm font-bold text-gray-700">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>Call: 09123456709</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>Email: support@mmemmeabia.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
