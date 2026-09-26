import { useCollection } from "@/hooks/useApi";
import { useBooking } from "@/hooks/useBooking";
import { useNavigate } from "react-router-dom";
import { money } from "@/lib/api";
import React from "react";
import {
  Navigation,
  Building2,
  UtensilsCrossed,
  CalendarDays,
  BookOpen,
} from "lucide-react";

const TourPlanVisitCard = ({ tour }) => {
  const navigate = useNavigate();
  const { data: packages } = useCollection(`/tour-packages/?experience=${tour.id}`);
  const { data: departures } = useCollection('/tour-departures/');
  const { book, busy } = useBooking();
  const available = departures.filter(d => packages.some(p => p.id === d.package));
  const items = [
    { icon: Navigation, label: "Get Directions" },
    { icon: Building2, label: "Nearby Hotels" },
    { icon: UtensilsCrossed, label: "Nearby Restaurants" },
    { icon: CalendarDays, label: "Upcoming Events" },
    { icon: BookOpen, label: "Travel Tips" },
  ];
  const bookingItems = available.map(d => ({ icon: BookOpen, label: `${new Date(d.starts_at).toLocaleString()} — ${money(d.price)}`, departure: d }));

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="font-bold text-base text-[#172033] mb-4">
        Plan Your Visit
      </h3>

      <div className="space-y-3">
        {[...bookingItems, ...items].map(({ icon: Icon, label, departure }) => (
          <button
            key={departure?.id || label}
            disabled={!!departure && (busy || departure.quantity_available < 1)}
            onClick={() => departure ? book("TOURISM", [{ id: departure.id, quantity: 1 }]) : label === "Nearby Hotels" ? navigate("/hotel") : label === "Nearby Restaurants" ? navigate("/food") : label === "Upcoming Events" ? navigate("/events") : label === "Get Directions" ? window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.address || tour.location)}`, "_blank", "noopener,noreferrer") : navigate("/about")}
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
