import React from "react";
import { Download, CalendarPlus, Share2 } from "lucide-react";

const TicketActions = () => {
  return (
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
  );
};

export default TicketActions;
