import React from "react";
import { useParams } from "react-router-dom";
import { hotels } from "../data/hotels";
import BookingAlert from "../components/bookingComfire/BookingAlert";
import BookSurmary from "../components/bookingComfire/BookSurmary";
import WhatNext from "../components/bookingComfire/WhatNext";

const BookingComfirmationPage = () => {
  const { id } = useParams();
  const hotel = hotels.find((h) => h.id === id);

  if (!hotel) {
    return (
      <div className="grid place-items-center min-h-screen">
        <p className="text-lg font-semibold">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="grid place-items-center">
      <div>
        <div className="bg-white shadow-md rounded-[12px] border-2 border-[#C1C9BB] p-5 w-250">
          <div className="grid grid-cols-2 justify-items-center p-5 min-w-10xl">
            <BookingAlert hotel={hotel} />
            <BookSurmary hotel={hotel} />
          </div>
          <hr />
          <div className="p-10">
            <WhatNext hotel={hotel} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingComfirmationPage;
