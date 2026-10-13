import { useNavigate } from "react-router-dom";
import React from "react";
import { TourBookingOptions } from '@/pages/TourismVisits';
import {
  Navigation,
  Building2,
  UtensilsCrossed,
  CalendarDays,
  BookOpen,
} from "lucide-react";

const TourPlanVisitCard = ({ tour }) => {
  const navigate = useNavigate();
  const items = [
    { icon: Navigation, label: "Get Directions" },
    { icon: Building2, label: "Nearby Hotels" },
    { icon: UtensilsCrossed, label: "Nearby Restaurants" },
    { icon: CalendarDays, label: "Upcoming Events" },
    { icon: BookOpen, label: "Travel Tips" },
  ];

  return (
    <div id="plan-visit" className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-4">
        Plan Your Visit
      </h3>

      <div className="space-y-3">
        <TourBookingOptions tour={tour} />
        {items.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => label === "Nearby Hotels" ? navigate("/hotel") : label === "Nearby Restaurants" ? navigate("/food") : label === "Upcoming Events" ? navigate("/events") : label === "Get Directions" ? window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.address || tour.location)}`, "_blank", "noopener,noreferrer") : navigate("/about")}
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
