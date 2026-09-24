import React from "react";

const SuccessMessage = ({ total }) => {
  return (
    <>
      <h1 className="text-3xl font-extrabold text-black mb-3 text-center">
        {total === 0 ? "Booking Confirmed!" : "Payment Successful!"}
      </h1>

      <p className="text-gray-600 font-medium text-center text-sm md:text-base leading-relaxed mb-10 max-w-md">
        Your booking is confirmed.{" "}
        <br className="hidden md:block" />Your confirmation email has been queued for delivery.
      </p>
    </>
  );
};

export default SuccessMessage;
