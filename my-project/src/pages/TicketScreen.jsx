import { useCollection } from "@/hooks/useApi";
import { bookingCard } from "@/lib/catalog";
import { useSearchParams } from "react-router-dom";
import React, { useRef, useState } from "react";
import toast from 'react-hot-toast';
import { api } from '@/lib/api';
import TicketCard from "../components/ticket/TicketCard";
import ImportantNotes from "../components/ticket/ImportantNotes";
import TicketActions from "../components/ticket/TicketActions";
import NeedHelpCard from "../components/ticket/NeedHelpCard";

export default function TicketScreen() {
  const ticketRef = useRef(null);
  const [params] = useSearchParams();
  const { data: bookings, loading, reload: reloadBookings } = useCollection('/bookings/', bookingCard);
  const { data: tickets, reload: reloadTickets } = useCollection('/tickets/');
  const [cancelling, setCancelling] = useState(false);
  const booking = bookings.find(b => b.id === params.get('booking')) || (!params.get('booking') ? bookings.find(b => b.kind === 'EVENT' && b.status === 'Confirmed') : null);
  const issued = tickets.filter(t => t.booking === booking?.id);
  const activeTickets = issued.filter(ticket => ticket.status === 'ACTIVE' || ticket.status === 'USED');
  const canCancel = booking?.kind === 'EVENT' && booking.status === 'Confirmed' && booking.fulfillment_status === 'NEW' && new Date(booking.details?.start_datetime).getTime() > Date.now();
  const cancelBooking = async () => {
    if (cancelling || !canCancel || !window.confirm('Cancel this booking and all its tickets? Paid tickets will receive a full refund through Paystack.')) return;
    setCancelling(true);
    try {
      await api(`/bookings/${booking.id}/cancel/`, { method: 'POST' });
      reloadBookings();
      reloadTickets();
      toast.success(booking.totalAmount > 0 ? 'Tickets cancelled. Your refund has been requested.' : 'Tickets cancelled.');
    } catch (error) { toast.error(error.message); }
    finally { setCancelling(false); }
  };
  if (!booking) return <p role="status">{loading ? 'Loading tickets...' : 'No confirmed ticket booking found.'}</p>;
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-400 mb-8 flex gap-2 flex-wrap">
          <span>Events</span> &gt;
          <span>{booking?.title || "Event"}</span> &gt;
          <span>Checkout</span> &gt;
          <span>Payment Successful</span> &gt;
          <span className="text-gray-600">Your Ticket</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-black">
            Your Ticket
          </h1>

          <p className="text-gray-600 font-medium">{activeTickets.length ? 'Present this QR code at the venue entrance.' : booking.status === 'Refund pending' ? 'These tickets were cancelled. Your refund is being processed.' : 'No active tickets are available for this booking.'}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            <div ref={ticketRef} className="space-y-6">{activeTickets.map(ticket => <TicketCard key={ticket.id} booking={booking} ticket={ticket} />)}</div>

            <ImportantNotes />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-6">
            <TicketActions ticketRef={ticketRef} booking={booking} available={activeTickets.length > 0} canCancel={canCancel} cancelling={cancelling} onCancel={cancelBooking} />

            <NeedHelpCard />
          </div>
        </div>
      </div>
    </div>
  );
}
