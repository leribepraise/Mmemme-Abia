import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Car,
  Bus,
  Truck,
  Package,
  CalendarDays,
  MapPin,
  Users,
} from "lucide-react";

const tabs = [
  { to: "/transport/ride", label: "Ride", icon: Car },
  { to: "/transport/shuttle", label: "Shuttle", icon: Bus },
  { to: "/transport/car-rentals", label: "Car Rental", icon: Truck },
  { to: "/transport/courier", label: "Courier / Delivery", icon: Package },
];

const TransportTabs = () => {
  const { pathname } = useLocation();

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-wrap gap-3 text-sm font-medium mb-5">
        {tabs.map(({ to, label, icon: Icon }) => {
          const isActive = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isActive
                  ? "bg-[#48782E] text-white"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <Input icon={MapPin} label="Pick-up Location" placeholder="Enter pickup location" />
        <Input icon={MapPin} label="Destination" placeholder="Enter destination" />
        <Input icon={CalendarDays} label="Date & Time" placeholder="Select date & time" />
        <Input icon={Users} label="Passengers" placeholder="1 Passenger" />

        <button className="bg-[#F97316] hover:bg-[#df5f18] text-white rounded-lg font-semibold h-12 self-end">
          Search Ride
        </button>
      </div>
    </div>
  );
};

const Input = ({ icon: Icon, label, placeholder }) => (
  <div className="border border-gray-200 rounded-lg px-3 py-2">
    <div className="flex items-center gap-2 text-xs text-gray-400 uppercase">
      <Icon className="w-3 h-3" />
      {label}
    </div>
    <input placeholder={placeholder} className="w-full outline-none text-sm mt-1" />
  </div>
);

export default TransportTabs;