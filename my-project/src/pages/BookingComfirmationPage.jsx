import React from "react";
import BookingAlert from "../components/bookingComfire/BookingAlert";
import BookSurmary from "../components/bookingComfire/BookSurmary";
import WhatNext from "../components/bookingComfire/WhatNext";

const BookingComfirmationPage = () => {
  return (
    <div className="grid place-items-center">
      <div>
        <div className="bg-white shadow-md rounded-[12px] border-2 border-[#C1C9BB] p-5 w-250">
          <div className="grid grid-cols-2 justify-items-center p-5 min-w-10xl">
            <BookingAlert />
            <BookSurmary />
          </div>
          <hr />
          <div className="p-10">
              <WhatNext />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingComfirmationPage;
