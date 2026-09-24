import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/components/context/AuthContext";
import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router-dom";

import SuccessIcon from "../components/paymentsuccess/SuccessIcon";
import SuccessMessage from "../components/paymentsuccess/SuccessMessage";
import EventSummaryCard from "../components/paymentsuccess/EventSummaryCard";
import ActionButtons from "../components/paymentsuccess/ActionButtons";

export default function PaymentSuccessfulScreen() {
  const location = useLocation();

  const { user } = useAuth();
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');
  const search = location.search;
  useEffect(() => {
    let active = true;
    const load = async () => {
      const params = new URLSearchParams(search);
      let id = params.get('booking');
      const reference = params.get('reference') || params.get('trxref');
      if (reference) { const payment = await api('/payments/verify-reference/', { method: 'POST', body: { reference } }); id = payment.booking; }
      if (!id) throw new Error('Choose a booking from your profile to view its status.');
      const result = await api(`/bookings/${id}/`);
      if (active) setBooking(result);
    };
    load().catch(error => { if (active) setError(error.message); });
    return () => { active = false; };
  }, [search]);
  const event = { ...location.state?.event, text: booking?.details?.title || booking?.items?.[0]?.description || 'Booking', text2: booking?.details?.location, location: booking?.details?.location, date: booking?.details?.start_datetime ? new Date(booking.details.start_datetime).toLocaleDateString() : '' };
  const tickets = booking?.items.map(item => ({ id: item.id, name: item.description, qty: item.quantity, basePrice: Number(item.unit_price) })) || [];
  const attendee = { fullName: booking?.customer_name, email: booking?.details?.attendee_email || user?.email };
  const total = Number(booking?.total_amount || 0);
  const orderId = booking?.booking_reference;
  if (!booking || booking.status !== 'CONFIRMED') return <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8"><div className="bg-white rounded-[12px] shadow-md p-8"><p role="status">{error || (booking ? `Your booking is ${booking.status.toLowerCase()}. Payment has not been confirmed.` : 'Checking your booking...')}</p><a href="/profile">My bookings</a></div></div>;
  if (booking.kind === 'HOTEL') return <Navigate to={`/book-comfire/${booking.id}`} replace />;
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[1000px]">
        <div className="bg-white rounded-[12px] flex flex-col justify-center items-center shadow-md p-4 sm:p-6 md:p-8">
          <SuccessIcon />

          <SuccessMessage total={total} />

          <EventSummaryCard event={event} total={total} orderId={orderId} />

          <ActionButtons
            bookingId={booking.id}
            booking={booking}
            event={event}
            tickets={tickets}
            attendee={attendee}
            total={total}
            orderId={orderId}
          />
        </div>
      </div>
    </div>
  );
}
