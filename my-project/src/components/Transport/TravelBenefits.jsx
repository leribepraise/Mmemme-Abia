import React from "react";
import { ShieldCheck, Clock3, BadgeCheck } from "lucide-react";

const TravelBenefits = () => {
  const items = [
    {
      icon: BadgeCheck,
      title: "Verified Drivers",
      text: "& Partners",
    },
    {
      icon: ShieldCheck,
      title: "Safe & Secure",
      text: "Journeys",
    },
    {
      icon: Clock3,
      title: "On-time",
      text: "Guarantee",
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="grid md:grid-cols-3 gap-5">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Icon className="w-5 h-5 text-[#48782E]" />
              </div>

              <div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TravelBenefits;
