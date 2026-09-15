import React from "react";

const PlanJourneyCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-2">
        Plan Your Spiritual Journey
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        Visit sacred sites, attend events and experience the spiritual side of
        Abia State.
      </p>

      <button className="w-full bg-[#3F783D] hover:bg-[#356433] text-white font-semibold py-2.5 rounded-lg transition">
        Plan Your Visit
      </button>
    </div>
  );
};

export default PlanJourneyCard;
