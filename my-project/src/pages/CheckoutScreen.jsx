import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Seo from "../components/seo/Seo";
import EventDetailsCard from "../components/checkout/EventDetailsCard";
import TicketSelectionCard from "../components/checkout/TicketSelectionCard";
import AttendeeInfoCard from "../components/checkout/AttendeeInfoCard";
import OrderSummaryCard from "../components/checkout/OrderSummaryCard";
import TrustBadgesCard from "../components/checkout/TrustBadgesCard";

export default function CheckoutScreen() {
  const location = useLocation();

  const { event, tickets: selectedTickets } = location.state || {};

  const isFree = event?.text3?.toLowerCase() === "free";

  const [tickets, setTickets] = useState([
    {
      id: "regular",
      name: "Regular",
      basePrice: isFree ? 0 : 3000,
      qty: selectedTickets?.regular || 0,
    },
    {
      id: "vip",
      name: "VIP",
      basePrice: isFree ? 0 : 10000,
      qty: selectedTickets?.vip || 0,
    },
    {
      id: "vvip",
      name: "VVIP",
      basePrice: isFree ? 0 : 20000,
      qty: selectedTickets?.vvip || 0,
    },
  ]);

  const [enabledTiers, setEnabledTiers] = useState({
    regular: (selectedTickets?.regular || 0) > 0,
    vip: (selectedTickets?.vip || 0) > 0,
    vvip: (selectedTickets?.vvip || 0) > 0,
  });

  // NEW: attendee information
  const [attendee, setAttendee] = useState(() => {
    const savedAttendee = sessionStorage.getItem("attendeeInfo");

    return savedAttendee
      ? JSON.parse(savedAttendee)
      : {
          fullName: "",
          email: "",
          buyingForSomeoneElse: false,
        };
  });

  const updateQty = (id, delta) => {
    if (isFree) return;

    setTickets((prevTickets) =>
      prevTickets.map((ticket) => {
        if (ticket.id === id) {
          const newQty = Math.max(0, ticket.qty + delta);

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
    if (isFree) return;

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

      sessionStorage.setItem("attendeeInfo", JSON.stringify(updatedAttendee));

      return updatedAttendee;
    });
  };

  const formatCurrency = (amount) => `N${amount.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <Seo title="Checkout" noIndex path="/checkout" />
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
