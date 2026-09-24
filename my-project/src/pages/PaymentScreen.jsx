import React, { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Seo from "../components/seo/Seo";
import PaymentMethodsSidebar from "../components/payment/PaymentMethodsSidebar";
import PaymentForm from "../components/payment/PaymentForm";
import PaymentSummary from "../components/payment/PaymentSummary";
import SupportBox from "../components/payment/SupportBox";

export default function PaymentScreen() {
  const location = useLocation();
  const navigate = useNavigate();

  const { event, tickets, subtotal, serviceFee, total } = location.state || {};

  const [activeMethod, setActiveMethod] = useState("card");

  const isFree = total === 0;

  const handleConfirmFree = () => {
    navigate("/Paymentsuccess", {
      state: { event, tickets, subtotal, serviceFee, total },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <Seo title="Payment" noIndex path="/payment" />
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="text-sm text-gray-400 mb-4 flex gap-2">
            <span>Events</span>
            &gt;
            <span>{event?.text || "Event"}</span>
            &gt;
            <span>Checkout</span>
            &gt;
            <span className="text-gray-300">Payment</span>
          </div>

          <h1 className="text-[40px] font-bold mb-2 text-black">
            {isFree ? "Confirm Registration" : "Payment"}
          </h1>

          <p className="text-[#3D3E3E] text-[18px] font-semibold">
            {isFree
              ? "This event is free — just confirm to complete your booking."
              : "Complete your payment to confirm your booking."}
          </p>
        </div>

        {isFree ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
                <CheckCircle2 className="w-14 h-14 text-[#48782E] mb-4" />

                <h2 className="text-xl font-bold text-black mb-2">
                  No Payment Required
                </h2>

                <p className="text-gray-500 mb-6 max-w-md">
                  This event has free entry. Click below to confirm your
                  registration and receive your ticket.
                </p>

                <button
                  onClick={handleConfirmFree}
                  className="bg-[#F46F1A] hover:bg-[#d95d1d] text-white font-bold py-3.5 px-10 rounded-lg transition-colors shadow-sm"
                >
                  Confirm Free Registration
                </button>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-6">
              <PaymentSummary
                event={event}
                tickets={tickets}
                subtotal={subtotal}
                serviceFee={serviceFee}
                total={total}
              />

              <SupportBox />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <PaymentMethodsSidebar
              activeMethod={activeMethod}
              setActiveMethod={setActiveMethod}
            />

            <PaymentForm event={event} tickets={tickets} total={total} />

            <div className="lg:col-span-4 space-y-6">
              <PaymentSummary
                event={event}
                tickets={tickets}
                subtotal={subtotal}
                serviceFee={serviceFee}
                total={total}
              />

              <SupportBox />
            </div>
          </div>
        )}

        <div className="mt-8">
          <NavLink to="/checkout">
            <button className="flex items-center gap-2 text-[#48782E] font-bold text-sm hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Back to Checkout
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
}
