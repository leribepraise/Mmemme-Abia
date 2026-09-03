import React from "react";
import { Clock, Wallet, Phone } from "lucide-react";

const RestaurantStats = () => {
  const stats = [
    {
      icon: Clock,
      title: "Open Daily",
      text: "8:00 AM - 10:00 PM",
    },
    {
      icon: Wallet,
      title: "Price Range",
      text: "₦2,000 - ₦8,000",
    },
    {
      icon: Phone,
      title: "Phone",
      text: "+234 812 345 6789",
    },
  ];

  return (
    <div className="px-4 md:px-5 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div key={stat.title} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#EAF6EA] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-[#48782E]" />
              </div>

              <div>
                <p className="text-[9px] font-semibold text-gray-500">
                  {stat.title}
                </p>

                <p className="text-[10px] font-medium text-gray-800">
                  {stat.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RestaurantStats;
