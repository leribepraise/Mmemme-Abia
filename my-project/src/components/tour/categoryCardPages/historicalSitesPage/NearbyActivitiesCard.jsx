import React from "react";
import { Compass, Landmark, PartyPopper, ShoppingBag } from "lucide-react";

const NearbyActivitiesCard = () => {
  const activities = [
    {
      icon: Compass,
      title: "Cultural Tours",
      subtitle: "Explore local history",
    },
    {
      icon: Landmark,
      title: "Local Museums",
      subtitle: "Discover artifacts",
    },
    {
      icon: PartyPopper,
      title: "Cultural Festivals",
      subtitle: "Experience traditions",
    },
    {
      icon: ShoppingBag,
      title: "Craft Markets",
      subtitle: "Buy local crafts",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-4">
        Nearby Activities
      </h3>

      <div className="space-y-4">
        {activities.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-start gap-2">
            <Icon className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-[#172033] font-medium">{title}</p>
              <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyActivitiesCard;
