import React from "react";

import SuccessIcon from "../components/paymentsuccess/SuccessIcon";
import SuccessMessage from "../components/paymentsuccess/SuccessMessage";
import EventSummaryCard from "../components/paymentsuccess/EventSummaryCard";
import ActionButtons from "../components/paymentsuccess/ActionButtons";

export default function PaymentSuccessfulScreen() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-400 mb-12 flex gap-2">
          <span>Events</span> &gt;
          <span>Abia Business Summit 2026</span> &gt;
          <span>Checkout</span> &gt;
          <span className="text-gray-300">Payment Successful</span>
        </div>

        {/* Main Success Content */}
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mt-8">
          <SuccessIcon />

          <SuccessMessage />

          <EventSummaryCard />

          <ActionButtons />
        </div>
      </div>
    </div>
  );
}
