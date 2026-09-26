import { ArrowLeftRight, Bike, Car, MapPin, Package, User } from "lucide-react";

// Platform-wide totals (static until the backend exists)
export const transportStats = [
  {
    id: "rides",
    label: "Total Rides",
    value: "1,248",
    change: "+12%",
    icon: ArrowLeftRight,
    iconBox: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "drivers",
    label: "Active Drivers",
    value: "286",
    change: "+8%",
    icon: User,
    iconBox: "bg-rose-50 text-rose-500",
  },
  {
    id: "vehicles",
    label: "Vehicles",
    value: "312",
    change: "+10%",
    icon: Car,
    iconBox: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "bookingsToday",
    label: "Bookings Today",
    value: "142",
    change: "+6%",
    icon: MapPin,
    iconBox: "bg-amber-50 text-[#f28c28]",
  },
];

// Each card links to a sub-page under /admin/transport/*. Only the dashboard
// itself is built so far; these routes will 404 into the catch-all until built.
export const transportServices = [
  {
    id: "rides",
    label: "Rides",
    description: "On-demand & scheduled",
    icon: ArrowLeftRight,
    iconBox: "bg-emerald-50 text-emerald-600",
    to: "/admin/transport/rides",
  },
  {
    id: "drivers",
    label: "Drivers",
    description: "Manage and verify drivers",
    icon: User,
    iconBox: "bg-emerald-50 text-emerald-600",
    to: "/admin/transport/drivers",
  },
  {
    id: "vehicles",
    label: "Vehicles",
    description: "Track and manage vehicles",
    icon: Car,
    iconBox: "bg-emerald-50 text-emerald-600",
    to: "/admin/transport/vehicles",
  },
  {
    id: "rentals",
    label: "Rentals",
    description: "Car & bike rentals",
    icon: Bike,
    iconBox: "bg-emerald-50 text-emerald-600",
    to: "/admin/transport/rentals",
  },
  {
    id: "shuttles",
    label: "Event Shuttles",
    description: "Group event transport",
    icon: MapPin,
    iconBox: "bg-emerald-50 text-emerald-600",
    to: "/admin/transport/shuttles",
  },
  {
    id: "courier",
    label: "Courier",
    description: "Package delivery",
    icon: Package,
    iconBox: "bg-emerald-50 text-emerald-600",
    to: "/admin/transport/courier",
  },
];

const STATUS_TONES = {
  Ongoing: "text-[#f28c28]",
  Completed: "text-emerald-600",
  Pending: "text-amber-500",
  Cancelled: "text-red-500",
};

export const getBookingStatusTone = (status) =>
  STATUS_TONES[status] || "text-slate-500";

export const recentBookings = [
  {
    id: "#TRX-1245",
    service: "Ride",
    customer: "Chinedu Okafor",
    driver: "Tunde Bello",
    status: "Ongoing",
    time: "10:24 AM",
  },
  {
    id: "#TRX-1244",
    service: "Ride",
    customer: "Ada Nwosu",
    driver: "Musa Ibrahim",
    status: "Completed",
    time: "09:58 AM",
  },
  {
    id: "#TRX-1243",
    service: "Rental",
    customer: "Emeka Uche",
    driver: null,
    status: "Pending",
    time: "09:32 AM",
  },
  {
    id: "#TRX-1242",
    service: "Shuttle",
    customer: "Blessing Ojo",
    driver: "Chinedu Dike",
    status: "Ongoing",
    time: "08:45 AM",
  },
  {
    id: "#TRX-1241",
    service: "Courier",
    customer: "Tolu James",
    driver: null,
    status: "Completed",
    time: "08:20 AM",
  },
];

// Static placeholder trips for the Live Trips card (no real map/geolocation yet)
export const liveTrips = [
  {
    id: "t1",
    vehicle: "ABX 342 Yaris",
    status: "On Trip",
    minsLeft: 12,
    position: { top: "22%", left: "10%" },
  },
  {
    id: "t2",
    vehicle: "LAG 567 JK",
    status: "On Trip",
    minsLeft: 18,
    position: { top: "48%", left: "68%" },
  },
  {
    id: "t3",
    vehicle: "ABC 890 KIA",
    status: "On Trip",
    minsLeft: 25,
    position: { top: "78%", left: "18%" },
  },
];

// Transport Overview donut breakdown (percentages should sum to 100)
export const transportOverview = [
  { id: "rides", label: "Rides", value: 52, color: "#0f3d1b" },
  { id: "rentals", label: "Rentals", value: 18, color: "#3b82f6" },
  { id: "shuttles", label: "Shuttles", value: 15, color: "#f28c28" },
  { id: "courier", label: "Courier", value: 10, color: "#a855f7" },
  { id: "others", label: "Others", value: 5, color: "#94a3b8" },
];

export const totalBookingsAllTime = "1,248";
