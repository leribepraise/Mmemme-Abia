import toast from 'react-hot-toast';
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const [search, setSearch] = useState({ origin: '', destination: '', date: '', seats: '1' });
  const field = name => ({ value: search[name], onChange: event => setSearch({ ...search, [name]: event.target.value }) });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
      <div className="flex flex-wrap gap-3 text-sm font-medium mb-5">
        {tabs.map(({ to, label, icon: Icon }) => {
          const isActive = pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              onClick={event => { if (to !== "/transport/shuttle") { event.preventDefault(); toast("Only scheduled shuttle bookings are available right now."); } }}
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
        <Input icon={MapPin} label="Pick-up Location" {...field("origin")} placeholder="Enter pickup location" />
        <Input icon={MapPin} label="Destination" {...field("destination")} placeholder="Enter destination" />
        <Input icon={CalendarDays} label="Date" type="date" {...field("date")} placeholder="Select date & time" />
        <Input icon={Users} label="Passengers" type="number" min="1" max="6" {...field("seats")} placeholder="1 Passenger" />

        <button onClick={() => navigate(`/transport/shuttle?${new URLSearchParams(search)}`)} className="bg-[#F97316] hover:bg-[#df5f18] text-white rounded-lg font-semibold h-12 self-end">
          Search Shuttles
        </button>
      </div>
    </div>
  );
};

const Input = ({ icon: Icon, label, placeholder, ...props }) => (
  <div className="border border-gray-200 rounded-lg px-3 py-2">
    <div className="flex items-center gap-2 text-xs text-gray-400 uppercase">
      <Icon className="w-3 h-3" />
      {label}
    </div>
    <input {...props} placeholder={placeholder} className="w-full outline-none text-sm mt-1" />
  </div>
);

export default TransportTabs;