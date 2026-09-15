import React from "react";

const NeedGearCard = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-2">
        Need Gear or Guide?
      </h3>

      <p className="text-sm text-gray-500 leading-relaxed mb-4">
        Find local guides and rent adventure gear for your trip.
      </p>

      <div className="flex items-center gap-3">
        <button className="bg-[#3F783D] hover:bg-[#356433] text-white font-semibold text-sm px-4 py-2.5 rounded-lg transition shrink-0">
          Find a Guide
        </button>

        <div className="w-16 h-14 rounded-lg overflow-hidden shrink-0">
          <img
            src="/gear-thumb.jpg"
            alt="Adventure gear"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default NeedGearCard;
