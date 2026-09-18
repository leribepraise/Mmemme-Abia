import React from "react";
import { Link } from "react-router-dom";

const OrderSummaryCard = ({
  tickets = [],
  formatCurrency = (val) => `₦${val.toLocaleString()}`,
  event,
  isFree = false,
}) => {
  const subtotal = tickets.reduce(
    (acc, ticket) => acc + (ticket.basePrice || 0) * (ticket.qty || 0),
    0
  );

  const serviceFee = isFree ? 0 : 1250;
  const total = subtotal + serviceFee;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      {/* CARD TITLE */}
      <h2 className="mb-6 text-xl font-extrabold text-gray-900 md:text-2xl">
        Order Summary
      </h2>

      {/* LINE ITEMS */}
      <div className="mb-6 space-y-4 text-sm font-semibold text-gray-700 md:text-base">
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Subtotal</span>
          <span className="font-extrabold text-gray-900">
            {formatCurrency(subtotal)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-700">Service Fee</span>
          <span className="font-extrabold text-gray-900">
            {isFree ? "Free" : formatCurrency(serviceFee)}
          </span>
        </div>
      </div>

      {/* TOTAL BAR */}
      <div className="mb-8 flex items-center justify-between border-t border-gray-100 pt-5">
        <span className="text-lg font-bold text-gray-900 md:text-xl">Total</span>
        <span className="text-2xl font-black text-[#265F27] md:text-3xl">
          {formatCurrency(total)}
        </span>
      </div>

      {/* ACTION BUTTON */}
      <Link
        to="/Payment"
        state={{
          event,
          tickets,
          subtotal,
          serviceFee,
          total,
          isFree,
        }}
        className="mb-6 block"
      >
        <button className="w-full cursor-pointer rounded-xl bg-[#F97316] py-4 text-sm font-extrabold text-white shadow-md transition hover:bg-[#ea580c] md:text-base">
          {isFree ? "Confirm Free Registration" : "Proceed to Payment"}
        </button>
      </Link>

      {/* PAYMENT METHODS FOOTER */}
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