import React from "react";
import {
  Navigation,
  Building2,
  UtensilsCrossed,
  CalendarDays,
  BookOpen,
} from "lucide-react";

const TourPlanVisitCard = () => {
  const items = [
    { icon: Navigation, label: "Get Directions" },
    { icon: Building2, label: "Nearby Hotels" },
    { icon: UtensilsCrossed, label: "Nearby Restaurants" },
    { icon: CalendarDays, label: "Upcoming Events" },
    { icon: BookOpen, label: "Travel Tips" },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-4">
        Plan Your Visit
      </h3>

      <div className="space-y-3">
        {items.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#3F783D] transition w-full text-left"
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TourPlanVisitCard;
