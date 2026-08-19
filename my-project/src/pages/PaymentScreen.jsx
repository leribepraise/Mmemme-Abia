import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { NavLink } from "react-router-dom";

import PaymentMethodsSidebar from "../components/payment/PaymentMethodsSidebar";
import PaymentForm from "../components/payment/PaymentForm";
import PaymentSummary from "../components/payment/PaymentSummary";
import SupportBox from "../components/payment/SupportBox";

export default function PaymentScreen() {
  const [activeMethod, setActiveMethod] = useState("card");

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="text-sm text-gray-400 mb-4 flex gap-2">
            <span>Events</span>
            &gt;
            <span>Abia Business Summit 2026</span>
            &gt;
            <span>Checkout</span>
            &gt;
            <span className="text-gray-300">Payment</span>
          </div>

          <h1 className="text-[40px] font-bold mb-2 text-black">Payment</h1>

          <p className="text-[#3D3E3E] text-[18px] font-semibold">
            Complete your payment to confirm your booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <PaymentMethodsSidebar
            activeMethod={activeMethod}
            setActiveMethod={setActiveMethod}
          />

          <PaymentForm />

          <div className="lg:col-span-4 space-y-6">
            <PaymentSummary />

            <SupportBox />
          </div>
        </div>

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
