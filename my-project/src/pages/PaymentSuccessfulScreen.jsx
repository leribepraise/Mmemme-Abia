// import React, { useEffect } from "react";
// import { useLocation } from "react-router-dom";

// import SuccessIcon from "../components/paymentsuccess/SuccessIcon";
// import SuccessMessage from "../components/paymentsuccess/SuccessMessage";
// import EventSummaryCard from "../components/paymentsuccess/EventSummaryCard";
// import ActionButtons from "../components/paymentsuccess/ActionButtons";

// export default function PaymentSuccessfulScreen() {
//   const location = useLocation();

//   const { event, tickets, subtotal, serviceFee, total } = location.state || {};

//   // Create one Order ID for this booking
//   const orderId = `MBA-${Date.now()}`;

//   useEffect(() => {
//     // The booking that was just successfully paid for
//     const booking = {
//       id: orderId,
//       title: event?.text || "Event",
//       image: event?.image || "/checkout.jpg",
//       location: event?.text2 || "Location unavailable",
//       price: `₦${(total || 0).toLocaleString()}`,
//       status: "Confirmed",
//       tickets: tickets || [],
//     };

//     // Get existing bookings
//     const savedBookings = sessionStorage.getItem("bookings");

//     let bookings = [];

//     try {
//       bookings = savedBookings ? JSON.parse(savedBookings) : [];

//       if (!Array.isArray(bookings)) {
//         bookings = [];
//       }
//     } catch (error) {
//       console.error("Error reading bookings:", error);
//       bookings = [];
//     }

//     // Prevent the same booking from being added again
//     // when the user refreshes the success page
//     const alreadyExists = bookings.some(
//       (existingBooking) => existingBooking.id === booking.id,
//     );

//     if (!alreadyExists) {
//       sessionStorage.setItem(
//         "bookings",
//         JSON.stringify([booking, ...bookings]),
//       );
//     }
//   }, [event, tickets, total, orderId]);

//   return (
//     <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
//       <div className="max-w-6xl mx-auto">
//         {/* Breadcrumbs */}
//         <div className="text-sm text-gray-400 mb-12 flex gap-2">
//           <span>Events</span> &gt;
//           <span>{event?.text || "Event"}</span> &gt;
//           <span>Checkout</span> &gt;
//           <span className="text-gray-300">Payment Successful</span>
//         </div>

//         {/* Main Success Content */}
//         <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mt-8">
//           <SuccessIcon />

//           <SuccessMessage />

//           <EventSummaryCard event={event} total={total} orderId={orderId} />

//           <ActionButtons
//             event={event}
//             tickets={tickets}
//             total={total}
//             orderId={orderId}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";

// import SuccessIcon from "../components/paymentsuccess/SuccessIcon";
// import SuccessMessage from "../components/paymentsuccess/SuccessMessage";
// import EventSummaryCard from "../components/paymentsuccess/EventSummaryCard";
// import ActionButtons from "../components/paymentsuccess/ActionButtons";

// export default function PaymentSuccessfulScreen() {
//   const location = useLocation();

//   const { event, tickets, attendee, subtotal, serviceFee, total } =
//     location.state || {};

//   // Create one Order ID for this booking
//   const orderId = useRef(`MBA-${Date.now()}`).current;

//   useEffect(() => {
//     // The booking that was just successfully paid for
//     const booking = {
//       id: orderId,
//       title: event?.text || "Event",
//       image: event?.image || "/checkout.jpg",
//       location: event?.text2 || "Location unavailable",
//       price: `₦${(total || 0).toLocaleString()}`,
//       status: "Confirmed",
//       tickets: tickets || [],
//       attendee: attendee || {},
//     };

//     // Get existing bookings
//     const savedBookings = sessionStorage.getItem("bookings");

//     let bookings = [];

//     try {
//       bookings = savedBookings ? JSON.parse(savedBookings) : [];

//       if (!Array.isArray(bookings)) {
//         bookings = [];
//       }
//     } catch (error) {
//       console.error("Error reading booking:", error);
//       bookings = [];
//     }

//     // Prevent the same booking from being added again
//     // when the user refreshes the success page
//     const alreadyExists = bookings.some(
//       (existingBooking) => existingBooking.id === booking.id,
//     );

//     if (!alreadyExists) {
//       sessionStorage.setItem(
//         "bookings",
//         JSON.stringify([booking, ...bookings]),
//       );
//     }
//   }, [event, tickets, attendee, total, orderId]);

//   return (
//     <div className="min-h-screen bg-gray-50/50 p-4 md:p-8 font-sans text-gray-800">
//       <div className="max-w-6xl mx-auto">
//         {/* Breadcrumbs */}
//         <div className="text-sm text-gray-400 mb-12 flex gap-2">
//           <span>Events</span> &gt;
//           <span>{event?.text || "Event"}</span> &gt;
//           <span>Checkout</span> &gt;
//           <span className="text-gray-300">Payment Successful</span>
//         </div>

//         {/* Main Success Content */}
//         <div className="flex flex-col items-center justify-center max-w-3xl mx-auto mt-8">
//           <SuccessIcon />

//           <SuccessMessage />

//           <EventSummaryCard event={event} total={total} orderId={orderId} />

//           <ActionButtons
//             event={event}
//             tickets={tickets}
//             attendee={attendee}
//             total={total}
//             orderId={orderId}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";

// import SuccessIcon from "../components/paymentsuccess/SuccessIcon";
// import SuccessMessage from "../components/paymentsuccess/SuccessMessage";
// import EventSummaryCard from "../components/paymentsuccess/EventSummaryCard";
// import ActionButtons from "../components/paymentsuccess/ActionButtons";

// export default function PaymentSuccessfulScreen() {
//   const location = useLocation();

//   const { event, tickets, attendee, subtotal, serviceFee, total } =
//     location.state || {};

//   // Create one stable Order ID for this booking
//   const orderId = useRef(`MBA-${Date.now()}`).current;

//   useEffect(() => {
//     const booking = {
//       id: orderId,
//       type: "event",

//       title: event?.text || "Event",
//       image: event?.image || "/checkout.jpg",
//       location: event?.text2 || "Location unavailable",

//       price: `₦${(total || 0).toLocaleString()}`,
//       payment: "Paid",
//       status: "Confirmed",

//       tickets: tickets || [],
//       attendee: attendee || {},

//       subtotal: subtotal || 0,
//       serviceFee: serviceFee || 0,
//       total: total || 0,
//     };

//     const savedBookings = sessionStorage.getItem("bookings");

//     let bookings = [];

//     try {
//       bookings = savedBookings ? JSON.parse(savedBookings) : [];

//       if (!Array.isArray(bookings)) {
//         bookings = [];
//       }
//     } catch (error) {
//       console.error("Error reading bookings:", error);
//       bookings = [];
//     }

//     const alreadyExists = bookings.some(
//       (existingBooking) => existingBooking.id === booking.id,
//     );

//     if (!alreadyExists) {
//       sessionStorage.setItem(
//         "bookings",
//         JSON.stringify([booking, ...bookings]),
//       );

//       // Tell MyBookings and other components that a new booking was created
//       window.dispatchEvent(new Event("bookingsUpdated"));
//     }
//   }, [event, tickets, attendee, subtotal, serviceFee, total, orderId]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-[1000px]">
//         <div className="bg-white rounded-[12px] shadow-md p-4 sm:p-6 md:p-8">
//           <SuccessIcon />

//           <SuccessMessage />

//           <EventSummaryCard event={event} total={total} orderId={orderId} />

//           <ActionButtons
//             event={event}
//             tickets={tickets}
//             attendee={attendee}
//             total={total}
//             orderId={orderId}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useRef } from "react";
// import { useLocation } from "react-router-dom";

// import SuccessIcon from "../components/paymentsuccess/SuccessIcon";
// import SuccessMessage from "../components/paymentsuccess/SuccessMessage";
// import EventSummaryCard from "../components/paymentsuccess/EventSummaryCard";
// import ActionButtons from "../components/paymentsuccess/ActionButtons";

// export default function PaymentSuccessfulScreen() {
//   const location = useLocation();

//   const { event, tickets, attendee, subtotal, serviceFee, total } =
//     location.state || {};

//   // Create one stable Order ID for this booking
//   const orderId = useRef(`MBA-${Date.now()}`).current;

//   useEffect(() => {
//     if (!event) return;

//     const booking = {
//       id: orderId,
//       type: "event",

//       // Event information
//       title: event?.text || "Event",
//       image: event?.image || "/checkout.jpg",
//       location: event?.text2 || "Location unavailable",

//       // Date information
//       date: event?.date || "Date unavailable",
//       dateNumber: event?.dateDay || "",
//       month: event?.dateMonth || "",

//       // Payment information
//       price: `₦${(total || 0).toLocaleString()}`,
//       payment: "Paid",
//       status: "Confirmed",

//       // Ticket information
//       tickets: tickets || [],
//       attendee: attendee || {},

//       // Price breakdown
//       subtotal: subtotal || 0,
//       serviceFee: serviceFee || 0,
//       total: total || 0,
//     };

//     const savedBookings = sessionStorage.getItem("bookings");

//     let bookings = [];

//     try {
//       bookings = savedBookings ? JSON.parse(savedBookings) : [];

//       if (!Array.isArray(bookings)) {
//         bookings = [];
//       }
//     } catch (error) {
//       console.error("Error reading bookings:", error);
//       bookings = [];
//     }

//     const alreadyExists = bookings.some(
//       (existingBooking) => existingBooking.id === booking.id,
//     );

//     if (!alreadyExists) {
//       sessionStorage.setItem(
//         "bookings",
//         JSON.stringify([booking, ...bookings]),
//       );

//       // Notify MyBookings that a new booking has been created
//       window.dispatchEvent(new Event("bookingsUpdated"));
//     }
//   }, [event, tickets, attendee, subtotal, serviceFee, total, orderId]);

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
//       <div className="w-full max-w-[1000px]">
//         <div className="bg-white rounded-[12px] shadow-md p-4 sm:p-6 md:p-8">
//           <SuccessIcon />

//           <SuccessMessage />

//           <EventSummaryCard event={event} total={total} orderId={orderId} />

//           <ActionButtons
//             event={event}
//             tickets={tickets}
//             attendee={attendee}
//             total={total}
//             orderId={orderId}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

import SuccessIcon from "../components/paymentsuccess/SuccessIcon";
import SuccessMessage from "../components/paymentsuccess/SuccessMessage";
import EventSummaryCard from "../components/paymentsuccess/EventSummaryCard";
import ActionButtons from "../components/paymentsuccess/ActionButtons";

export default function PaymentSuccessfulScreen() {
  const location = useLocation();

  const { event, tickets, attendee, subtotal, serviceFee, total } =
    location.state || {};

  // Create one stable Order ID for this booking
  const orderId = useRef(`MBA-${Date.now()}`).current;

  useEffect(() => {
    if (!event) return;

    // Calculate total number of tickets
    const totalTickets = Object.values(tickets || {}).reduce(
      (sum, quantity) => sum + Number(quantity || 0),
      0,
    );

    const booking = {
      id: orderId,
      type: "event",

      eventId: event?.id,

      title: event?.text || "Event",
      image: event?.image || "/checkout.jpg",
      location: event?.text2 || "Location unavailable",

      date: event?.date || "Date unavailable",
      dateNumber: event?.dateDay || "",
      month: event?.dateMonth || "",

      quantity: `${totalTickets} ${totalTickets === 1 ? "Ticket" : "Tickets"}`,

      price: `₦${(total || 0).toLocaleString()}`,
      payment: "Paid",
      status: "Confirmed",

      tickets: tickets || {},
      attendee: attendee || {},

      subtotal: subtotal || 0,
      serviceFee: serviceFee || 0,
      total: total || 0,
    };

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

    const alreadyExists = bookings.some(
      (existingBooking) => existingBooking.id === booking.id,
    );

    if (!alreadyExists) {
      sessionStorage.setItem(
        "bookings",
        JSON.stringify([booking, ...bookings]),
      );

      // Notify MyBookings that a booking was created
      window.dispatchEvent(new Event("bookingsUpdated"));
    }
  }, [event, tickets, attendee, subtotal, serviceFee, total, orderId]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[1000px]">
        <div className="bg-white rounded-[12px] flex flex-col justify-center items-center shadow-md p-4 sm:p-6 md:p-8">
          <SuccessIcon />

          <SuccessMessage />

          <EventSummaryCard event={event} total={total} orderId={orderId} />

          <ActionButtons
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
