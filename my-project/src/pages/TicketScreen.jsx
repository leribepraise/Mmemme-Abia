import React from "react";
import TicketCard from "../components/ticket/TicketCard";
import ImportantNotes from "../components/ticket/ImportantNotes";
import TicketActions from "../components/ticket/TicketActions";
import NeedHelpCard from "../components/ticket/NeedHelpCard";

export default function TicketScreen() {
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-400 mb-8 flex gap-2 flex-wrap">
          <span>Events</span> &gt;
          <span>Abia Business Summit 2026</span> &gt;
          <span>Checkout</span> &gt;
          <span>Payment Successful</span> &gt;
          <span className="text-gray-600">Your Ticket</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-black">
            Your Ticket
          </h1>

          <p className="text-gray-600 font-medium">
            Present this QR code at the venue entrance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-6">
            <TicketCard />

            <ImportantNotes />
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-4 space-y-6">
            <TicketActions />

            <NeedHelpCard />
          </div>
        </div>
      </div>
    </div>
  );
}
