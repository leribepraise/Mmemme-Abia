import React from "react";
import { Users, ParkingCircle, Wallet, PartyPopper } from "lucide-react";

const VenueStats = () => {
  const stats = [
    {
      icon: Users,
      title: "Capacity",
      value: "1,500 Guests",
    },
    {
      icon: ParkingCircle,
      title: "Parking",
      value: "200 Cars",
    },
    {
      icon: Wallet,
      title: "Starting Price",
      value: "From ₦45,000",
    },
    {
      icon: PartyPopper,
      title: "Best For",
      value: "Weddings, Conferences",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div key={stat.title} className="bg-[#F3F4F5] rounded-xl p-4 border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-green-700" />
            </div>

            <p className="text-xs text-gray-500">{stat.title}</p>
            <p className="font-bold text-sm mt-1">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
};

export default VenueStats;