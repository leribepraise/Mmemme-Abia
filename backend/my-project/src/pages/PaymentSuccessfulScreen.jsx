import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";

import SuccessIcon from "../components/paymentsuccess/SuccessIcon";
import SuccessMessage from "../components/paymentsuccess/SuccessMessage";
import EventSummaryCard from "../components/paymentsuccess/EventSummaryCard";
import ActionButtons from "../components/paymentsuccess/ActionButtons";

export default function PaymentSuccessfulScreen() {
  const location = useLocation();

  const { event, tickets, subtotal, serviceFee, total } = location.state || {};

  // Create one Order ID for this booking
  const orderId = `MBA-${Date.now()}`;

  useEffect(() => {
    // The booking that was just successfully paid for
    const booking = {
      id: orderId,
      title: event?.text || "Event",
      image: event?.image || "/checkout.jpg",
      location: event?.text2 || "Location unavailable",
      price: `₦${(total || 0).toLocaleString()}`,
      status: "Confirmed",
      tickets: tickets || [],
    };

    // Get existing bookings
    const savedBookings = sessionStorage.getItem("bookings");

    let bookings = [];

    try {
      bookings = savedBookings ? JSON.parse(savedBookings) : [];

      if (!Array.isArray(bookings)) {
        bookings = [];
      }
    } catch (error) {
      console.error("Error reading bookings:", error);
      bookings = [];
    }

    // Prevent the same booking from being added again
    // when the user refreshes the success page
    const alreadyExists = bookings.some(
      (existingBooking) => existingBooking.id === booking.id,
    );

    if (!alreadyExists) {
      sessionStorage.setItem(
        "bookings",
        JSON.stringify([booking, ...bookings]),
      );
    }
  }, [event, tickets, total, orderId]);

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <div className="text-sm text-gray-400 mb-12 flex gap-2">
          <span>Events</span> &gt;
          <span>{event?.text || "Event"}</span> &gt;
          <span>Checkout</span> &gt;
          <span className="text-gray-300">Payment Successful</span>
        </div>

        {/* Main Success Content */}
        <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mt-8">
          <SuccessIcon />

          <SuccessMessage />

          <EventSummaryCard event={event} total={total} orderId={orderId} />

          <ActionButtons />
        </div>
      </div>
    </div>
  );
}
