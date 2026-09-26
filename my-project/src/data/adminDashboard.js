import {
  Users,
  UsersRound,
  Ticket,
  Wallet,
  CalendarPlus,
  Hotel,
  Landmark,
  Store,
  UserCog,
  UserPlus,
  BadgeCheck,
  Banknote,
  CalendarDays,
  ClipboardList,
  BarChart3,
  FileText,
  Headset,
} from "lucide-react";

export const dashboardStats = [
  {
    id: "users",
    label: "Total Users",
    value: "12,458",
    change: "+12%",
    icon: Users,
  },
  {
    id: "bookings",
    label: "Total Bookings",
    value: "8,421",
    change: "+18%",
    icon: Ticket,
  },
  {
    id: "revenue",
    label: "Total Revenue",
    value: "₦5,230,000",
    change: "+24%",
    icon: Wallet,
  },
  {
    id: "organizers",
    label: "Active Organizers",
    value: "320",
    change: "+6%",
    icon: UsersRound,
  },
];

export const activityLabels = [
  "Apr 20",
  "Apr 21",
  "Apr 22",
  "Apr 23",
  "Apr 24",
  "Apr 25",
  "Apr 26",
];

export const activitySeries = {
  users: {
    label: "Users",
    prefix: "",
    values: [420, 850, 700, 1250, 900, 1500, 1900],
  },
  bookings: {
    label: "Bookings",
    prefix: "",
    values: [200, 340, 300, 520, 410, 690, 800],
  },
  revenue: {
    label: "Revenue",
    prefix: "₦",
    values: [120000, 260000, 210000, 480000, 350000, 610000, 720000],
  },
};

export const topCategories = [
  { name: "Events", value: 28, color: "#15803d" },
  { name: "Hotels", value: 18, color: "#2563eb" },
  { name: "Tourism", value: 15, color: "#0d9488" },
  { name: "Food", value: 12, color: "#ea580c" },
  { name: "Transport", value: 10, color: "#84cc16" },
  { name: "Community", value: 7, color: "#f59e0b" },
  { name: "Others", value: 10, color: "#cbd5e1" },
];

export const quickActions = [
  {
    label: "Add Event",
    to: "/admin/events/new",
    icon: CalendarPlus,
    tint: "bg-orange-50 text-orange-600",
  },
  {
    label: "Add Hotel",
    to: "/admin/hotels/new",
    icon: Hotel,
    tint: "bg-green-50 text-green-700",
  },
  {
    label: "Add Tourism Listing",
    to: "/admin/tourism/new",
    icon: Landmark,
    tint: "bg-teal-50 text-teal-600",
  },
  {
    label: "Add Food Vendor",
    to: "/admin/food/new",
    icon: Store,
    tint: "bg-amber-50 text-amber-600",
  },
  {
    label: "Manage Users",
    to: "/admin/users",
    icon: UserCog,
    tint: "bg-blue-50 text-blue-600",
  },
];

export const recentActivities = [
  {
    id: 1,
    title: "New user registered",
    description: "Chinedu Okafor joined Mmemme Abia",
    time: "2 minutes ago",
    icon: UserPlus,
    tint: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    title: "Event approved",
    description: "Cross River Cultural Festival was approved",
    time: "12 minutes ago",
    icon: BadgeCheck,
    tint: "bg-green-50 text-green-700",
  },
  {
    id: 3,
    title: "New booking",
    description: "A hotel room was booked at The Green Park Hotel",
    time: "25 minutes ago",
    icon: Hotel,
    tint: "bg-purple-50 text-purple-600",
  },
  {
    id: 4,
    title: "Payment received",
    description: "₦45,000 from a food vendor",
    time: "1 hour ago",
    icon: Banknote,
    tint: "bg-emerald-50 text-emerald-600",
  },
  {
    id: 5,
    title: "New organizer",
    description: "Abia Events Hub applied to become an organizer",
    time: "2 hours ago",
    icon: UsersRound,
    tint: "bg-orange-50 text-orange-600",
  },
];

export const quickLinks = [
  { label: "Users Management", to: "/admin/users", icon: Users },
  { label: "Events Management", to: "/admin/events", icon: CalendarDays },
  { label: "Bookings Overview", to: "/admin/bookings", icon: ClipboardList },
  { label: "Revenue Report", to: "/admin/analytics", icon: BarChart3 },
  { label: "Content Management", to: "/admin/content", icon: FileText },
  { label: "Support Tickets", to: "/admin/support", icon: Headset },
];
