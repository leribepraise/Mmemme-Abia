import React from "react";

const BookSurmary = ({ hotel }) => {
  const roomCharges = hotel.price;
  const serviceFee = 3000;
  const taxes = 2000;
  const total = roomCharges + serviceFee + taxes;

  return (
    <div className="bg-[#F8F9FA] rounded-[12px] p-5 border-2 border-[#C1C9BB] max-w-sm">
      <h1 className="font-semibold text-[20px] text-[#191C1D]">
        Booking Summary
      </h1>
      <hr />
      <div className="flex gap-2 mt-2">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-20 h-20 rounded-[8px]"
        />
        <div className="flex flex-col gap-y-2 mb-5">
          <h3 className="font-semibold text-[14px] text-[#191C1D]">
            {hotel.name}
          </h3>
          <p className="text-[#41493E] text-[14px] font-normal">
            Sat, 24 May 2026 - Sun, 25 May 2026
          </p>
          <p className="text-[#41493E] text-[14px] font-normal">
            1 Room, 2 Adults
          </p>
        </div>
      </div>
      <div className="flex justify-between">
        <p className="text-[#41493E] text-[14px] font-normal">Room Charges</p>
        <p className="text-[#191C1D] text-[14px] font-medium">
          ₦{roomCharges.toLocaleString()}
        </p>
      </div>
      <div className="flex justify-between">
        <p className="text-[#41493E] text-[14px] font-normal">Service Fee</p>
        <p className="text-[#191C1D] text-[14px] font-medium">
          ₦{serviceFee.toLocaleString()}
        </p>
      </div>
      <div className="flex justify-between mb-5">
        <p className="text-[#41493E] text-[14px] font-normal">
          Taxes & Charges
        </p>
        <p className="text-[#191C1D] text-[14px] font-medium">
          ₦{taxes.toLocaleString()}
        </p>
      </div>
      <hr />
      <div className="flex justify-between pt-2">
        <p className="text-[20px] text-[#191C1D] font-semibold">Total Paid</p>
        <p className="text-[24px] text-[#3F783D] font-bold">
          ₦{total.toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default BookSurmary;
