import React from "react";
import { ShieldCheck, Lock, Headphones, BadgeCheck } from "lucide-react";

const WhyBookCard = () => {
  const items = [
    {
      icon: ShieldCheck,
      title: "Best Price Guarantee",
      text: "We offer the best prices on all hotels",
      color: "text-orange-500",
    },
    {
      icon: Lock,
      title: "Secure Booking",
      text: "Your booking is safe and protected",
      color: "text-green-500",
    },
    {
      icon: Headphones,
      title: "24/7 Customer Support",
      text: "We're here to help you anytime",
      color: "text-purple-500",
    },
    {
      icon: BadgeCheck,
      title: "Verified Properties",
      text: "Quality stays you can trust",
      color: "text-blue-500",
    },
  ];

  return (
    <div className="bg-white rounded-[12px] p-5 border border-gray-200">
      <h3 className="font-bold text-[16px] text-[#111827] mb-5">
        Why Book with Mmemme Abia?
      </h3>

      <div className="space-y-4">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div key={item.title} className="flex gap-3">
              <Icon className={`w-5 h-5 ${item.color}`} />

              <div>
                <h4 className="font-semibold text-[14px] text-[#111827]">
                  {item.title}
                </h4>
                <p className="text-[12px] text-[#6B7280] font-normal">{item.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WhyBookCard;
