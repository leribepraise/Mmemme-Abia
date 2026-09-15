import React from "react";
import { Footprints, Droplet, Leaf, UserRound } from "lucide-react";

const PlanAdventureCard = () => {
  const tips = [
    { icon: Footprints, text: "Wear comfortable hiking shoes" },
    { icon: Droplet, text: "Carry enough water and snacks" },
    { icon: Leaf, text: "Respect nature and keep it clean" },
    { icon: UserRound, text: "Go with a local guide for safety" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-2">
        Plan Your Adventure
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        Explore safely and make the most of your adventure.
      </p>

      <div className="space-y-3 mb-4">
        {tips.map(({ icon: Icon, text }) => (
          <div key={text} className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-[#3F783D] shrink-0" />
            <p className="text-sm text-gray-600">{text}</p>
          </div>
        ))}
      </div>

      <div className="w-full h-24 rounded-lg overflow-hidden bg-gray-100">
        <img
          src="/adventure-thumb.jpg"
          alt="Adventure"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PlanAdventureCard;
