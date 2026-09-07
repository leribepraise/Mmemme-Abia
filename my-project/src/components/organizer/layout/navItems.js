import {
  CalendarDays, LayoutDashboard, MessageSquare, PieChart, Plus,
  Settings as SettingsIcon, Ticket, Users, Wallet,
} from "lucide-react";

export const navItems = [
  { href: "/organizer/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/organizer/events", label: "My Events", icon: CalendarDays },
  { href: "/organizer/events/new", label: "Create Event", icon: Plus },
  { href: "/organizer/ticket-sales", label: "Ticket & Sales", icon: Ticket },
  { href: "/organizer/attendees", label: "Attendees", icon: Users },
  { href: "/organizer/messages", label: "Messages", icon: MessageSquare },
  { href: "/organizer/analytics", label: "Analytics", icon: PieChart },
  { href: "/organizer/payouts", label: "Payouts", icon: Wallet },
  { href: "/organizer/settings", label: "Settings", icon: SettingsIcon },
];
