import { Navigate } from "react-router-dom";
import { useAuth } from "@/components/context/AuthContext";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import EventDetailsCard from "../components/checkout/EventDetailsCard";
import TicketSelectionCard from "../components/checkout/TicketSelectionCard";
import AttendeeInfoCard from "../components/checkout/AttendeeInfoCard";
import OrderSummaryCard from "../components/checkout/OrderSummaryCard";
import TrustBadgesCard from "../components/checkout/TrustBadgesCard";

export default function CheckoutScreen() {
  const location = useLocation();

  const { event, tickets: selectedTickets } = location.state || {};



  const { user } = useAuth();
  const [tickets, setTickets] = useState(() => (event?.ticket_types || []).map(t => ({ id: t.id, name: t.name, basePrice: Number(t.price), available: t.quantity_available, qty: selectedTickets?.[t.id] || 0 })));
  const isFree = tickets.every(t => t.qty === 0 || t.basePrice === 0);
  const [enabledTiers, setEnabledTiers] = useState(() => Object.fromEntries(tickets.map(t => [t.id, t.qty > 0])));
  const [attendee, setAttendee] = useState({ fullName: user?.fullName || '', email: user?.email || '', buyingForSomeoneElse: false });
  const updateQty = (id, delta) => {


    setTickets((prevTickets) =>
      prevTickets.map((ticket) => {
        if (ticket.id === id) {
          const newQty = Math.max(0, Math.min(20, ticket.available, ticket.qty + delta));

          return {
            ...ticket,
            qty: newQty,
          };
        }

        return ticket;
      }),
    );
  };

  const toggleTier = (id) => {


    setEnabledTiers((prev) => {
      const nowEnabled = !prev[id];

      if (!nowEnabled) {
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket.id === id ? { ...ticket, qty: 0 } : ticket,
          ),
        );
      }

      return { ...prev, [id]: nowEnabled };
    });
  };

  // NEW: update attendee information
  const updateAttendee = (field, value) => {
    setAttendee((prev) => {
      const updatedAttendee = {
        ...prev,
        [field]: value,
      };



      return updatedAttendee;
    });
  };

  const formatCurrency = (amount) => `N${amount.toLocaleString()}`;

  if (!event) return <Navigate to="/events" replace />;
  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="text-sm text-gray-400 mb-4 flex gap-2">
            <span>Events</span>
            &gt;
            <span>{event?.text || "Event"}</span>
            &gt;
            <span className="text-gray-300">Checkout</span>
          </div>

          <h1 className="text-[40px] font-bold mb-2 text-black">Checkout</h1>

          <p className="text-[#3D3E3E] font-semibold">
            You're almost there! Complete your booking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <EventDetailsCard event={event} />

            <TicketSelectionCard
              tickets={tickets}
              updateQty={updateQty}
              enabledTiers={enabledTiers}
              toggleTier={toggleTier}
              formatCurrency={formatCurrency}
              isFree={isFree}
            />

            <AttendeeInfoCard
              attendee={attendee}
              updateAttendee={updateAttendee}
            />
          </div>

          <div className="space-y-6">
            <OrderSummaryCard
              attendee={attendee}
              tickets={tickets}
              formatCurrency={formatCurrency}
              event={event}
              isFree={isFree}
            />

            <TrustBadgesCard />
          </div>
        </div>
      </div>
    </div>
  );
}
