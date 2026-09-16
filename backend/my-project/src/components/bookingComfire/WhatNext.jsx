import React from "react";

const WhatNext = () => {
  const next = [
    {
      title: "Check your email",
      text: "We've sent your booking details and receipt",
    },
    {
      title: "Add to calendar",
      text: "Don't forget to save your booking dates.",
    },
    {
      title: "Plan your trip",
      text: "Explore attractions and experiences in Abia.",
    },
    {
      title: "Need help?",
      text: "Contact our support team anytime.",
    },
  ];
  return (
    <div>
      <h3 className="text-[#191C1D] font-semibold text-[20px] mb-5">What's Next?</h3>
      <div className="flex justify-around  gap-3">
        {next.map((items) => (
          <div className="space-y-3">
            <p className="text-[#191C1D] font-semibold text-[14px]">
              {items.title}
            </p>
            <p className="text-[#41493E] font-normal text-[14px]">
              {items.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatNext;
