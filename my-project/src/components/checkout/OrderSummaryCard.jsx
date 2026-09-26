import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import { api } from "@/lib/api";
import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const OrderSummaryCard = ({
  attendee,
  tickets = [],
  formatCurrency = (val) => `₦${val.toLocaleString()}`,
  event,
  isFree = false,
}) => {
  const subtotal = tickets.reduce(
    (acc, ticket) => acc + (ticket.basePrice || 0) * (ticket.qty || 0),
    0,
  );

  const hasAnyTicket = tickets.some((ticket) => (ticket.qty || 0) > 0);
  const canProceed = hasAnyTicket;

  const serviceFee = 0;
  const total = subtotal + serviceFee;

  const navigate = useNavigate();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const request = useRef(null);
  const handleProceedClick = async () => {
    if (busy) return;
    if (!canProceed) { toast.error('Please select at least one ticket.'); return; }
    if (!user.email_verified) { navigate('/verify-email'); return; }
    if (!user.phone) { toast.error('Add your phone number in Profile settings before booking.'); return; }
    const body = { kind: 'EVENT', items: tickets.filter(t => t.qty > 0).map(t => ({ id: t.id, quantity: t.qty })), customer_name: attendee?.fullName || user.fullName, customer_phone: user.phone, details: { attendee_email: attendee?.email || user.email, booking_for_someone_else: !!attendee?.buyingForSomeoneElse } };
    const signature = JSON.stringify(body);
    if (request.current?.signature !== signature) request.current = { signature, key: crypto.randomUUID() };
    setBusy(true);
    try {
      const booking = await api('/bookings/', { method: 'POST', body, key: request.current.key });
      navigate(booking.status === 'CONFIRMED' ? `/Paymentsuccess?booking=${booking.id}` : `/Payment?booking=${booking.id}`, { state: { event, tickets, attendee, booking } });
    } catch (error) { toast.error(error.message); } finally { setBusy(false); }
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-6 text-xl font-extrabold text-gray-900 md:text-2xl">
        Order Summary
      </h2>

      <div className="mb-6 space-y-4 text-sm font-semibold text-gray-700 md:text-base">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Subtotal</span>
          <span className="font-extrabold text-gray-900">
            {isFree ? "Free" : formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Service Fee</span>
          <span className="font-extrabold text-gray-900">
            {isFree ? "Free" : formatCurrency(serviceFee)}
          </span>
        </div>
      </div>

      <div className="mb-8 flex items-center justify-between border-t border-gray-100 pt-5">
        <span className="text-lg font-bold text-gray-900 md:text-xl">
          Total
        </span>
        <span className="text-2xl font-black text-[#265F27] md:text-3xl">
          {isFree ? "Free" : formatCurrency(total)}
        </span>
      </div>

      {/* ACTION BUTTON */}
      <div className="mb-6">
        <div className="block">
          <button
            disabled={busy}
            onClick={handleProceedClick}
            type="button"
            className={`w-full rounded-xl py-4 text-sm font-extrabold text-white shadow-md transition md:text-base ${
              canProceed
                ? "cursor-pointer bg-[#F97316] hover:bg-[#ea580c]"
                : "cursor-not-allowed bg-[#F97316]/40"
            }`}
          >
            {isFree ? "Confirm Free Registration" : "Proceed to Payment"}
          </button>
        </div>
      </div>

      {!isFree && (
        <div className="text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-400">
            We accept
          </p>

          <div className="flex items-center justify-center gap-4 rounded-xl border border-gray-100 bg-gray-50/70 p-3.5">
            <span className="text-lg font-black italic tracking-tighter text-blue-900">
              VISA
            </span>

            <div className="flex items-center">
              <div className="h-5 w-5 rounded-full bg-red-500 opacity-90 -mr-1.5" />
              <div className="h-5 w-5 rounded-full bg-amber-500 opacity-90 mix-blend-multiply" />
            </div>

            <span className="text-xs font-black tracking-widest text-gray-800">
              VERVE
            </span>

            <span className="flex items-center gap-1 text-xs font-bold text-sky-600">
              <span className="text-[10px] font-black">≡</span> paystack
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummaryCard;
