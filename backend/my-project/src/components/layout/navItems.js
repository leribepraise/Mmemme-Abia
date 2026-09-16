import {
  CalendarDays, LayoutDashboard, MessageSquare, PieChart, Plus,
  Settings as SettingsIcon, Ticket, Users, Wallet,
} from 'lucide-react';

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/events', label: 'My Events', icon: CalendarDays },
  { href: '/events/new', label: 'Create Event', icon: Plus },
  { href: '/ticket-sales', label: 'Ticket & Sales', icon: Ticket },
  { href: '/attendees', label: 'Attendees', icon: Users },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/analytics', label: 'Analytics', icon: PieChart },
  { href: '/payouts', label: 'Payouts', icon: Wallet },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];
