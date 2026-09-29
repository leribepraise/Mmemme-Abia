import toast from 'react-hot-toast';
import React from "react";
import { Download, MessageCircle, Share2, XCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';

const TicketActions = ({ ticketRef, booking, available, canCancel, cancelling, onCancel }) => {
  const navigate = useNavigate();
  const chat = async () => {
    try {
      const conversation = await api('/conversations/', { method: 'POST', body: { booking: booking.id } });
      navigate(`/message?conversation=${conversation.id}`);
    } catch (error) { toast.error(error.message); }
  };
  const makePdf = async () => {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([import('html2canvas-pro'), import('jspdf')]);
      const canvas = await html2canvas(ticketRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const pdf = new jsPDF({ unit: 'px', format: [canvas.width, canvas.height], hotfixes: ['px_scaling'] });
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, canvas.width, canvas.height);
      return new File([pdf.output('blob')], `tickets-${booking.orderId}.pdf`, { type: 'application/pdf' });
  };
  const download = async () => {
    if (!available) return toast.error('No tickets are available for this booking.');
    try {
      const file = await makePdf();
      const url = URL.createObjectURL(file);
      const link = document.createElement('a'); link.href = url; link.download = file.name; link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch { toast.error('The ticket could not be downloaded. Please try again.'); }
  };
  const share = async () => {
    if (!available) return toast.error('No tickets are available for this booking.');
    try {
      const file = await makePdf();
      if (navigator.canShare?.({ files: [file] })) await navigator.share({ files: [file], title: 'Mmemme Abia tickets' });
      else toast('File sharing is unavailable here. Use Download Ticket to share the PDF.');
    } catch (error) { if (error.name !== 'AbortError') toast.error('The ticket could not be shared. Please try again.'); }
  };

  return (
    <div className="space-y-4">
      <button onClick={download} className="w-full bg-[#F36B25] hover:bg-[#d95d1d] text-white font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
        <Download className="w-5 h-5" />
        Download Ticket
      </button>

      <button onClick={share} className="w-full bg-white border border-[#48782E] text-[#48782E] hover:bg-green-50 font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm">
        <Share2 className="w-5 h-5" />
        Share Ticket
      </button>
      <button onClick={chat} className="w-full bg-white border border-[#48782E] text-[#48782E] hover:bg-green-50 font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm"><MessageCircle className="w-5 h-5" /> Chat with organizer</button>
      {canCancel && <button type="button" disabled={cancelling} onClick={onCancel} className="w-full rounded-lg border border-red-300 bg-white px-4 py-3.5 font-bold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50 flex items-center justify-center gap-2"><XCircle className="w-5 h-5" />{cancelling ? 'Cancelling…' : 'Cancel booking and all tickets'}</button>}
    </div>
  );
};

export default TicketActions;
