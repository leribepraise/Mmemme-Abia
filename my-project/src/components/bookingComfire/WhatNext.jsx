import React from "react";
import { Mail, Calendar, MapPin, HelpCircle } from "lucide-react";

const WhatNext = () => {
  const next = [
    {
      icon: Mail,
      title: "Check your email",
      text: "We've sent your booking details and receipt.",
    },
    {
      icon: Calendar,
      title: "Add to calendar",
      text: "Don't forget to save your booking dates.",
    },
    {
      icon: MapPin,
      title: "Plan your trip",
      text: "Explore attractions and experiences in Abia.",
    },
    {
      icon: HelpCircle,
      title: "Need help?",
      text: "Contact our support team anytime.",
    },
  ];

  return (
    <div className="w-full">
      <h2 className="mb-6 text-xl font-extrabold text-gray-900 md:text-2xl">
        What's Next?
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {next.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="group rounded-2xl border border-gray-100 bg-gray-50/80 p-5 transition hover:border-gray-200 hover:bg-white hover:shadow-md"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#265F27]/10 text-[#265F27] transition group-hover:bg-[#F97316]/10 group-hover:text-[#F97316]">
                <Icon className="h-5 w-5" />
              </div>

              <h3 className="text-base font-extrabold text-gray-900 md:text-lg">
                {item.title}
              </h3>

              <p className="mt-1.5 text-sm font-semibold text-gray-600">
                {item.text}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhatNext;