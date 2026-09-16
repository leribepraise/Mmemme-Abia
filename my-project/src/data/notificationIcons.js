import {
  Ticket,
  CalendarCheck,
  Gift,
  Bell,
  Users,
  Car,
  Megaphone,
  Heart,
  Mail,
} from "lucide-react";

export const notificationIcons = {
  ticket: { icon: Ticket, bg: "bg-orange-100", color: "text-orange-600" },
  booking: { icon: CalendarCheck, bg: "bg-green-100", color: "text-green-600" },
  offer: { icon: Gift, bg: "bg-purple-100", color: "text-purple-600" },
  reminder: { icon: Bell, bg: "bg-blue-100", color: "text-blue-600" },
  community: { icon: Users, bg: "bg-orange-100", color: "text-orange-600" },
  ride: { icon: Car, bg: "bg-green-100", color: "text-green-600" },
  event: { icon: Megaphone, bg: "bg-green-100", color: "text-green-600" },
  saved: { icon: Heart, bg: "bg-orange-100", color: "text-orange-600" },
  welcome: { icon: Mail, bg: "bg-purple-100", color: "text-purple-600" },
};
