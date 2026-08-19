import React from "react";

const SuccessMessage = () => {
  return (
    <>
      <h1 className="text-3xl font-extrabold text-black mb-3 text-center">
        Payment Successful!
      </h1>

      <p className="text-gray-600 font-medium text-center text-sm md:text-base leading-relaxed mb-10 max-w-md">
        Your payment has been received and your tickets are confirmed.{" "}
        <br className="hidden md:block" />A confirmation email has been sent to
        you.
      </p>
    </>
  );
};

export default SuccessMessage;
