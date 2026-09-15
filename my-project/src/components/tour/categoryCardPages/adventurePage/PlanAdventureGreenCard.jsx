import React from "react";

const PlanAdventureGreenCard = () => {
  return (
    <div className="bg-[#EAF4EB] rounded-xl p-5">
      <h3 className="font-bold text-base text-[#172033] mb-2">
        Plan Your Adventure
      </h3>

      <p className="text-sm text-gray-600 leading-relaxed mb-4">
        From hiking and kayaking to exploring caves and rock formations.
      </p>

      <button className="w-full bg-[#3F783D] hover:bg-[#356433] text-white font-semibold py-2.5 rounded-lg transition mb-4">
        Plan Your Trip
      </button>

      <div className="w-full h-24 rounded-lg overflow-hidden">
        <img
          src="/adventure-map.jpg"
          alt="Adventure map"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default PlanAdventureGreenCard;
