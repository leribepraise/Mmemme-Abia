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
    <div className="w-full">
      <h3 className="text-[#191C1D] font-semibold text-[20px] mb-5 text-center sm:text-left">
        What's Next?
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
        {next.map((item) => (
          <div key={item.title} className="space-y-2">
            <p className="text-[#191C1D] font-semibold text-[14px]">
              {item.title}
            </p>
            <p className="text-[#41493E] font-normal text-[14px]">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatNext;
