import { CalendarDays, CheckCircle2, Clock, XCircle } from "lucide-react";

export const ALL_STATUSES = "All Statuses";
export const ALL_CATEGORIES = "All Categories";
export const EVENT_STATUSES = ["Pending", "Verified", "Suspended", "Rejected"];
export const EVENT_CATEGORIES = [
  "Culture",
  "Hospitality",
  "Food & Drink",
  "Transport",
  "Tourism",
  "Entertainment",
];

// Platform-wide totals (these will come from the backend later)
export const eventStats = [
  {
    id: "total",
    label: "Total Events",
    value: "248",
    change: "+12%",
    icon: CalendarDays,
    iconBox: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "pending",
    label: "Pending",
    value: "32",
    change: "-5%",
    icon: Clock,
    iconBox: "bg-amber-50 text-[#f28c28]",
  },
  {
    id: "approved",
    label: "Approved",
    value: "210",
    change: "+15%",
    icon: CheckCircle2,
    iconBox: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "rejected",
    label: "Rejected",
    value: "6",
    change: "-2%",
    icon: XCircle,
    iconBox: "bg-red-50 text-red-500",
  },
];

// Dates are ISO strings (YYYY-MM-DD) so the date-range filter can compare them
const seedEvents = [
  {
    id: "EVT-001",
    title: "Abia Cultural Festival",
    subtitle: "Abia Cultural Hub",
    organizer: "Abia Cultural Hub",
    location: "Umuahia North",
    date: "2025-01-12",
    status: "Pending",
    category: "Culture",
    image: null,
  },
  {
    id: "EVT-002",
    title: "Okpara Hotels & Suites Live",
    subtitle: "Okpara Hotels",
    organizer: "Okpara Hotels",
    location: "Umuahia North",
    date: "2025-01-08",
    status: "Verified",
    category: "Hospitality",
    image: null,
  },
  {
    id: "EVT-003",
    title: "Umuahia Food Hub",
    subtitle: "Umuahia Food Hub",
    organizer: "Umuahia Food Hub",
    location: "Umuahia South",
    date: "2025-02-15",
    status: "Pending",
    category: "Food & Drink",
    image: null,
  },
  {
    id: "EVT-004",
    title: "Ariaria Transport Expo",
    subtitle: "Ariaria Transport",
    organizer: "Ariaria Transport",
    location: "Aba South",
    date: "2025-01-05",
    status: "Verified",
    category: "Transport",
    image: null,
  },
  {
    id: "EVT-005",
    title: "Ndume Tourist Tour",
    subtitle: "Ndume Tourism",
    organizer: "Ndume Tourism",
    location: "Umuahia South",
    date: "2025-02-20",
    status: "Pending",
    category: "Tourism",
    image: null,
  },
  {
    id: "EVT-006",
    title: "Beverly Events",
    subtitle: "Beverly Events",
    organizer: "Beverly Events",
    location: "Aba North",
    date: "2025-01-02",
    status: "Verified",
    category: "Entertainment",
    image: null,
  },
  {
    id: "EVT-007",
    title: "Mountain View Resort Gala",
    subtitle: "Mountain View Resort",
    organizer: "Mountain View Resort",
    location: "Bende",
    date: "2024-12-18",
    status: "Verified",
    category: "Hospitality",
    image: null,
  },
  {
    id: "EVT-008",
    title: "Taste of Abia",
    subtitle: "TasteOfAbia",
    organizer: "TasteOfAbia",
    location: "Umuahia North",
    date: "2025-01-10",
    status: "Suspended",
    category: "Food & Drink",
    image: null,
  },
  {
    id: "EVT-009",
    title: "Abia Adventure Tour",
    subtitle: "Abia Adventures",
    organizer: "Abia Adventures",
    location: "Arochukwu",
    date: "2024-12-22",
    status: "Verified",
    category: "Tourism",
    image: null,
  },
  {
    id: "EVT-010",
    title: "Drive Abia Expo",
    subtitle: "Drive Abia",
    organizer: "Drive Abia",
    location: "Aba South",
    date: "2025-02-14",
    status: "Pending",
    category: "Transport",
    image: null,
  },
];

// Extra generated events so search, filters and pagination have something to work with
const titles = [
  "Aba Fashion Week",
  "Umuahia Music Fiesta",
  "Ohafia War Dance Festival",
  "Bende Farmers Fair",
  "Arochukwu Heritage Walk",
  "Isiala Ngwa Trade Show",
  "Ikwuano Food Carnival",
  "Osisioma Business Summit",
  "Ugwunagbo Youth Rally",
  "Ukwa Cultural Night",
  "Obi Ngwa Tech Meetup",
  "Umuahia Art Exhibition",
];
const organizers = [
  "Aba Events Co",
  "Heritage Abia",
  "Umuahia Live",
  "Abia Tourism Board",
  "Ngwa Collective",
  "Bende Events",
];
const locations = [
  "Aba North",
  "Ohafia",
  "Umuahia North",
  "Isiala Ngwa South",
  "Arochukwu",
  "Osisioma",
];
const statusCycle = [
  "Verified",
  "Pending",
  "Verified",
  "Verified",
  "Suspended",
  "Pending",
  "Verified",
  "Rejected",
];

const pad = (n) => String(n).padStart(2, "0");

const generatedEvents = Array.from({ length: 24 }, (_, i) => {
  const organizer = organizers[i % organizers.length];
  return {
    id: `EVT-${String(11 + i).padStart(3, "0")}`,
    title: i >= titles.length ? `${titles[i % titles.length]} II` : titles[i],
    subtitle: organizer,
    organizer,
    location: locations[i % locations.length],
    date: `2025-${pad(1 + (i % 3))}-${pad(1 + ((i * 5) % 28))}`,
    status: statusCycle[i % statusCycle.length],
    category: EVENT_CATEGORIES[i % EVENT_CATEGORIES.length],
    image: null,
  };
});

export const events = [...seedEvents, ...generatedEvents];
