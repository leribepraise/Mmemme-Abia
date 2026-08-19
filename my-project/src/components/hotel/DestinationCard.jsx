import React from "react";

const DestinationCard = () => {
  const places = [
    ["Umuahia", "120 Hotels"],
    ["Aba", "98 Hotels"],
    ["Arochukwu", "42 Hotels"],
    ["Bende", "28 Hotels"],
    ["Isiala Ngwa", "27 Hotels"],
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200">
      <div className="flex justify-between mb-5">
        <h3 className="font-bold">Top Destinations</h3>
        <button className="text-green-700 text-sm font-semibold">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {places.map(([name, hotels]) => (
          <div key={name}>
            <h4 className="font-semibold text-sm">{name}</h4>
            <p className="text-xs text-gray-500">{hotels}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationCard;
