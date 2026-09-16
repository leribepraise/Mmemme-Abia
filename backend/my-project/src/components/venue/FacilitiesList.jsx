import React from "react";
import { Check } from "lucide-react";

const FacilitiesList = () => {
  const facilities = [
    "Air Conditioning",
    "High Speed WiFi",
    "Sound System",
    "Stage & Lighting",
    "Ample Parking",
    "Backup Power",
    "Catering Services",
    "Security",
  ];

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">Facilities</h3>

      <div className="grid md:grid-cols-2 gap-y-5">
        {facilities.map((item) => (
          <div key={item} className="flex items-center gap-3">
            <Check className="w-5 h-5 text-green-700" />
            <span className="text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacilitiesList;
