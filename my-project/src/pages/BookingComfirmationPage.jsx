// import React from "react";
// import { useParams } from "react-router-dom";
// import { hotels } from "../data/hotels";
// import BookingAlert from "../components/bookingComfire/BookingAlert";
// import BookSurmary from "../components/bookingComfire/BookSurmary";
// import WhatNext from "../components/bookingComfire/WhatNext";

// const BookingComfirmationPage = () => {
//   const { id } = useParams();
//   const hotel = hotels.find((h) => h.id === id);

//   if (!hotel) {
//     return (
//       <div className="grid place-items-center min-h-screen">
//         <p className="text-lg font-semibold">Booking not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid place-items-center">
//       <div>
//         <div className="bg-white shadow-md rounded-[12px] border-2 border-[#C1C9BB] p-5 w-250">
//           <div className="grid grid-cols-2 justify-items-center p-5 min-w-10xl">
//             <BookingAlert hotel={hotel} />
//             <BookSurmary hotel={hotel} />
//           </div>
//           <hr />
//           <div className="p-10">
//             <WhatNext hotel={hotel} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingComfirmationPage;
// import React from "react";
// import { useParams } from "react-router-dom";
// import { hotels } from "../data/hotels";
// import BookingAlert from "../components/bookingComfire/BookingAlert";
// import BookSurmary from "../components/bookingComfire/BookSurmary";
// import WhatNext from "../components/bookingComfire/WhatNext";
// import DownloadTicketButton from "../components/bookingComfire/bookTicketDownload/DownloadTicketButton";

// const BookingComfirmationPage = () => {
//   const { id } = useParams();
//   const hotel = hotels.find((h) => h.id === id);

//   if (!hotel) {
//     return (
//       <div className="grid place-items-center min-h-screen">
//         <p className="text-lg font-semibold">Booking not found</p>
//       </div>
//     );
//   }

//   const bookingRef = `MMA${hotel.id.slice(0, 4).toUpperCase()}${Date.now()
//     .toString()
//     .slice(-4)}`;

//   return (
//     <div className="min-h-screen grid place-items-center px-4 py-8">
//       <div className="w-full max-w-[1000px]">
//         <div className="bg-white shadow-md rounded-[12px] border-2 border-[#C1C9BB] p-4 sm:p-5">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center p-2 sm:p-5">
//             <BookingAlert hotel={hotel} bookingRef={bookingRef} />
//             <BookSurmary hotel={hotel} />
//           </div>
//           <hr />
//           <div className="p-4 sm:p-6 md:p-10 flex flex-col items-center gap-5">
//             <WhatNext hotel={hotel} />
//             <DownloadTicketButton hotel={hotel} bookingRef={bookingRef} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingComfirmationPage;

// import React, { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { hotels } from "../data/hotels";

// import BookingAlert from "../components/bookingComfire/BookingAlert";
// import BookSurmary from "../components/bookingComfire/BookSurmary";
// import WhatNext from "../components/bookingComfire/WhatNext";
// import DownloadTicketButton from "../components/bookingComfire/bookTicketDownload/DownloadTicketButton";

// const BookingComfirmationPage = () => {
//   const { id } = useParams();

//   const hotel = hotels.find((h) => h.id === id);

//   const bookingRef = hotel
//     ? `MMA${hotel.id.slice(0, 4).toUpperCase()}${Date.now()
//         .toString()
//         .slice(-4)}`
//     : "";

//   useEffect(() => {
//     if (!hotel) return;

//     const roomCharges = hotel.price || 0;
//     const serviceFee = 3000;
//     const taxes = 2000;
//     const total = roomCharges + serviceFee + taxes;

//     const booking = {
//       id: bookingRef,

//       // Important: tells MyBookings this is a hotel
//       type: "hotel",

//       title: hotel.name,
//       image: hotel.image,
//       location: hotel.location || "Location unavailable",

//       // Current hotel booking information
//       date: "Sat, 24 May 2026 – Sun, 25 May 2026",
//       quantity: "1 Room, 2 Adults",

//       price: `₦${total.toLocaleString()}`,
//       payment: "Paid",
//       status: "Confirmed",

//       dateNumber: "24",
//       month: "MAY",

//       // Keep the original hotel data available
//       hotel: hotel,

//       // Cost breakdown
//       roomCharges,
//       serviceFee,
//       taxes,
//       total,
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

//     // Prevent duplicate booking
//     const alreadyExists = bookings.some(
//       (existingBooking) => existingBooking.id === booking.id,
//     );

//     if (!alreadyExists) {
//       sessionStorage.setItem(
//         "bookings",
//         JSON.stringify([booking, ...bookings]),
//       );

//       // Tell MyBookings that a new booking was created
//       window.dispatchEvent(new Event("bookingsUpdated"));
//     }
//   }, [hotel, bookingRef]);

//   if (!hotel) {
//     return (
//       <div className="grid min-h-screen place-items-center">
//         <p className="text-lg font-semibold">Booking not found</p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid min-h-screen place-items-center px-4 py-8">
//       <div className="w-full max-w-[1000px]">
//         <div className="rounded-[12px] border-2 border-[#C1C9BB] bg-white p-4 shadow-md sm:p-5">
//           <div className="grid grid-cols-1 justify-items-center gap-8 p-2 sm:p-5 md:grid-cols-2">
//             <BookingAlert hotel={hotel} bookingRef={bookingRef} />

//             <BookSurmary hotel={hotel} />
//           </div>

//           <hr />

//           <div className="flex flex-col items-center gap-5 p-4 sm:p-6 md:p-10">
//             <WhatNext hotel={hotel} />

//             <DownloadTicketButton hotel={hotel} bookingRef={bookingRef} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BookingComfirmationPage;

import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { hotels } from "../data/hotels";

import BookingAlert from "../components/bookingComfire/BookingAlert";
import BookSurmary from "../components/bookingComfire/BookSurmary";
import WhatNext from "../components/bookingComfire/WhatNext";
import DownloadTicketButton from "../components/bookingComfire/bookTicketDownload/DownloadTicketButton";

const BookingComfirmationPage = () => {
  const { id } = useParams();

  const hotel = hotels.find((h) => h.id === id);

  // Create the booking reference only once
  const bookingRef = useRef(
    hotel
      ? `MMA${hotel.id.slice(0, 4).toUpperCase()}${Date.now()
          .toString()
          .slice(-4)}`
      : "",
  ).current;

  useEffect(() => {
    if (!hotel) return;

    const roomCharges = hotel.price || 0;
    const serviceFee = 3000;
    const taxes = 2000;
    const total = roomCharges + serviceFee + taxes;

    const booking = {
      id: bookingRef,
      type: "hotel",

      hotelId: hotel.id,

      title: hotel.name,
      image: hotel.image,
      location: hotel.location || "Location unavailable",

      date: "Sat, 24 May 2026 – Sun, 25 May 2026",
      quantity: "1 Room, 2 Adults",

      price: `₦${total.toLocaleString()}`,
      payment: "Paid",
      status: "Confirmed",

      hotel: hotel,

      roomCharges,
      serviceFee,
      taxes,
      total,
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

      window.dispatchEvent(new Event("bookingsUpdated"));
    }
  }, [hotel, bookingRef]);

  if (!hotel) {
    return (
      <div className="grid min-h-screen place-items-center">
        <p className="text-lg font-semibold">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center px-4 py-8">
      <div className="w-full max-w-[1000px]">
        <div className="rounded-[12px] border-2 border-[#C1C9BB] bg-white p-4 shadow-md sm:p-5">
          <div className="grid grid-cols-1 justify-items-center gap-8 p-2 sm:p-5 md:grid-cols-2">
            <BookingAlert hotel={hotel} bookingRef={bookingRef} />

            <BookSurmary hotel={hotel} />
          </div>

          <hr />

          <div className="flex flex-col items-center gap-5 p-4 sm:p-6 md:p-10">
            <WhatNext hotel={hotel} />

            <DownloadTicketButton hotel={hotel} bookingRef={bookingRef} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingComfirmationPage;
