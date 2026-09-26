import { Archive, CheckCircle2, Clock, XCircle } from "lucide-react";

export const ALL_STATUSES = "All Status";
export const ALL_CATEGORIES = "All Categories";

// Matches Events/Organizers in structure, but uses "Approved" instead of "Verified"
// to match this screen's badge wording.
export const TOURISM_STATUSES = [
  "Approved",
  "Pending",
  "Suspended",
  "Rejected",
];

export const TOURISM_CATEGORIES = [
  "Nature & Parks",
  "Historical Sites",
  "Caves & Hills",
  "Religious Sites",
  "Adventure Sites",
];

// The pills above the table use the same list, with an "All" pill prepended.
// Pill selection and the "All Categories" dropdown stay in sync (one shared filter).
export const TOURISM_CATEGORY_PILLS = ["All", ...TOURISM_CATEGORIES];

// Platform-wide totals (static until the backend exists)
export const tourismStats = [
  {
    id: "total",
    label: "Total Listings",
    value: "156",
    change: "+12%",
    icon: Archive,
    iconBox: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "pending",
    label: "Pending",
    value: "18",
    change: "-5%",
    icon: Clock,
    iconBox: "bg-amber-50 text-[#f28c28]",
  },
  {
    id: "approved",
    label: "Approved",
    value: "132",
    change: "+10%",
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

// Dates are ISO strings (YYYY-MM-DD) so a future date-range filter can compare them
const seedListings = [
  {
    id: "TOU-001",
    name: "Osisioma Forest Reserve",
    category: "Nature & Parks",
    location: "Osisioma",
    dateAdded: "2025-04-12",
    status: "Approved",
    image: null,
  },
  {
    id: "TOU-002",
    name: "Aba Heritage Museum",
    category: "Historical Sites",
    location: "Aba",
    dateAdded: "2025-04-10",
    status: "Pending",
    image: null,
  },
  {
    id: "TOU-003",
    name: "Ngwa Caves",
    category: "Caves & Hills",
    location: "Isiala Ngwa",
    dateAdded: "2025-04-08",
    status: "Approved",
    image: null,
  },
  {
    id: "TOU-004",
    name: "Saint Michael's Church",
    category: "Religious Sites",
    location: "Umuahia",
    dateAdded: "2025-04-05",
    status: "Approved",
    image: null,
  },
  {
    id: "TOU-005",
    name: "Arochukwu Waterfalls",
    category: "Nature & Parks",
    location: "Arochukwu",
    dateAdded: "2025-04-03",
    status: "Pending",
    image: null,
  },
  {
    id: "TOU-006",
    name: "Itu Mbaise Hills",
    category: "Adventure Sites",
    location: "Ikwuano",
    dateAdded: "2025-03-28",
    status: "Approved",
    image: null,
  },
  {
    id: "TOU-007",
    name: "Nsulu Lake",
    category: "Nature & Parks",
    location: "Nsulu",
    dateAdded: "2025-03-25",
    status: "Rejected",
    image: null,
  },
  {
    id: "TOU-008",
    name: "Old Umuahia Town",
    category: "Historical Sites",
    location: "Umuahia",
    dateAdded: "2025-03-20",
    status: "Approved",
    image: null,
  },
];

// Extra generated listings so search, filters and pagination have something to work with
const names = [
  "Ohafia Mountain Trail",
  "Bende Rock Formation",
  "Umuahia Botanical Garden",
  "Isiala Ngwa Shrine",
  "Arochukwu Long Juju Slave Route",
  "Ikwuano River Bank",
  "Obi Ngwa Nature Walk",
  "Ugwunagbo Hilltop View",
  "Ukwa Mangrove Forest",
  "Osisioma Craft Village",
  "Ntigha Ancient Wall",
  "Item Cultural Grounds",
];
const locations = [
  "Ohafia",
  "Bende",
  "Umuahia",
  "Isiala Ngwa",
  "Arochukwu",
  "Ikwuano",
  "Obi Ngwa",
  "Ugwunagbo",
  "Ukwa",
  "Osisioma",
];
const statusCycle = [
  "Approved",
  "Pending",
  "Approved",
  "Approved",
  "Suspended",
  "Pending",
  "Approved",
  "Rejected",
];

const pad = (n) => String(n).padStart(2, "0");

const generatedListings = Array.from({ length: 20 }, (_, i) => ({
  id: `TOU-${String(9 + i).padStart(3, "0")}`,
  name: i >= names.length ? `${names[i % names.length]} II` : names[i],
  category: TOURISM_CATEGORIES[i % TOURISM_CATEGORIES.length],
  location: locations[i % locations.length],
  dateAdded: `2025-${pad(1 + (i % 4))}-${pad(1 + ((i * 5) % 28))}`,
  status: statusCycle[i % statusCycle.length],
  image: null,
}));

export const tourismListings = [...seedListings, ...generatedListings];
