import toast from 'react-hot-toast';
import React from "react";
import { Download, CalendarPlus, Share2 } from "lucide-react";

const TicketActions = ({ ticketRef, booking, available }) => {
  const download = async () => {
    if (!available) return toast.error('No tickets are available for this booking.');
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([import('html2canvas-pro'), import('jspdf')]);
      const canvas = await html2canvas(ticketRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height], hotfixes: ['px_scaling'] });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`tickets-${booking.orderId}.pdf`);
    } catch { toast.error('The ticket could not be downloaded. Please try again.'); }
  };
  const share = () => toast('Download the ticket, then share the file with your intended attendee.');

  return (
    <div className="space-y-4">
      <button onClick={download} className="w-full bg-[#F36B25] hover:bg-[#d95d1d] text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
        <Download className="w-5 h-5" />
        Download Ticket
      </button>

      <button onClick={() => toast("Wallet passes are not available yet.")} className="w-full bg-white border border-[#48782E] text-[#48782E] hover:bg-green-50 font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
        <CalendarPlus className="w-5 h-5" />
        Add to Wallet
      </button>

      <button onClick={share} className="w-full bg-white border border-[#48782E] text-[#48782E] hover:bg-green-50 font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
        <Share2 className="w-5 h-5" />
        Share Ticket
      </button>
    </div>
  );
};

export default TicketActions;
