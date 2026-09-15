import React from "react";
import { Leaf, UserRound, HeartHandshake } from "lucide-react";

const PlanVisitCard = () => {
  const tips = [
    {
      icon: Leaf,
      title: "Best visited in dry season",
      subtitle: "(November — April)",
    },
    {
      icon: UserRound,
      title: "Hire a local guide for",
      subtitle: "deeper insights",
    },
    {
      icon: HeartHandshake,
      title: "Respect the sites and",
      subtitle: "preserve our heritage",
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-4">
        Plan Your Visit
      </h3>

      <div className="space-y-4 mb-5">
        {tips.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-start gap-2">
            <Icon className="w-4 h-4 text-[#3F783D] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm text-[#172033] font-medium">{title}</p>
              <p className="text-xs text-gray-400">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full bg-[#3F783D] hover:bg-[#356433] text-white font-semibold py-2.5 rounded-lg transition">
        Plan Your Trip
      </button>
    </div>
  );
};

export default PlanVisitCard;
