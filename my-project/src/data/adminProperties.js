import { Building2, CheckCircle2, Clock, XCircle } from "lucide-react";

export const ALL_STATUSES = "All Status";
export const ALL_TYPES = "All Types";

export const PROPERTY_STATUSES = [
  "Approved",
  "Pending",
  "Suspended",
  "Rejected",
];
export const PROPERTY_TYPES = ["Hotel", "Hostel", "Short-Stay"];

// Platform-wide totals (static until the backend exists)
export const propertyStats = [
  {
    id: "total",
    label: "Total Properties",
    value: "124",
    change: "+12%",
    icon: Building2,
    iconBox: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "pending",
    label: "Pending",
    value: "18",
    change: "-8%",
    icon: Clock,
    iconBox: "bg-amber-50 text-[#f28c28]",
  },
  {
    id: "approved",
    label: "Approved",
    value: "98",
    change: "+10%",
    icon: CheckCircle2,
    iconBox: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "rejected",
    label: "Rejected",
    value: "8",
    change: "-5%",
    icon: XCircle,
    iconBox: "bg-red-50 text-red-500",
  },
];

// Dates are ISO strings (YYYY-MM-DD) so a future date-range filter can compare them.
// `host` is the business/host name shown under the property name (matches the
// "Hosts" sub-item under Hotels & Stays). It sometimes matches the property
// name itself (e.g. "Royal Suites" hosted by "Royal Suites").
const seedProperties = [
  {
    id: "PROP-001",
    name: "Osimma Grand Hotel",
    host: "Osimma Hotels & Suites",
    type: "Hotel",
    location: "Umuahia",
    dateAdded: "2025-04-12",
    status: "Approved",
    image: null,
  },
  {
    id: "PROP-002",
    name: "White Hill Resort",
    host: "White Hill Resort",
    type: "Hotel",
    location: "Aba",
    dateAdded: "2025-04-10",
    status: "Pending",
    image: null,
  },
  {
    id: "PROP-003",
    name: "Green Leaf Hostel",
    host: "Green Leaf Hostel",
    type: "Hostel",
    location: "Umuahia",
    dateAdded: "2025-04-08",
    status: "Approved",
    image: null,
  },
  {
    id: "PROP-004",
    name: "Royal Suites",
    host: "Royal Suites",
    type: "Hotel",
    location: "Aba",
    dateAdded: "2025-04-05",
    status: "Approved",
    image: null,
  },
  {
    id: "PROP-005",
    name: "The Cozy Stay",
    host: "The Cozy Stay",
    type: "Short-Stay",
    location: "Umuahia",
    dateAdded: "2025-04-03",
    status: "Pending",
    image: null,
  },
  {
    id: "PROP-006",
    name: "Palm View Hotel",
    host: "Palm View Hotels",
    type: "Hotel",
    location: "Aba",
    dateAdded: "2025-03-28",
    status: "Approved",
    image: null,
  },
  {
    id: "PROP-007",
    name: "Bamboo Hostel",
    host: "Bamboo Hostel",
    type: "Hostel",
    location: "Ohafia",
    dateAdded: "2025-03-25",
    status: "Approved",
    image: null,
  },
  {
    id: "PROP-008",
    name: "City Lodge",
    host: "City Lodge",
    type: "Short-Stay",
    location: "Umuahia",
    dateAdded: "2025-03-20",
    status: "Rejected",
    image: null,
  },
  {
    id: "PROP-009",
    name: "Golden Gate Hotel",
    host: "Golden Gate Hotels",
    type: "Hotel",
    location: "Aba",
    dateAdded: "2025-03-18",
    status: "Approved",
    image: null,
  },
  {
    id: "PROP-010",
    name: "Emerald Apartments",
    host: "Emerald Apartments",
    type: "Short-Stay",
    location: "Umuahia",
    dateAdded: "2025-03-15",
    status: "Pending",
    image: null,
  },
];

// Extra generated properties so search, filters and pagination have something to work with
const names = [
  "Ivory Court Hotel",
  "Sunrise Lodge",
  "Maple Suites",
  "Riverside Hostel",
  "Crescent Hotel",
  "Harmony Stays",
  "Silverline Hotel",
  "Cedar Hostel",
  "Blue Roof Hotel",
  "Amber Court",
  "Willow Short-Stay",
  "Heritage Inn",
];
const hosts = [
  "Aba Hospitality Group",
  "Umuahia Stay Collective",
  "Ngwa Lodging Co",
  "Abia Hosts Network",
  "Bende Stays Ltd",
];
const locations = [
  "Umuahia",
  "Aba",
  "Ohafia",
  "Arochukwu",
  "Bende",
  "Isiala Ngwa",
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

const generatedProperties = Array.from({ length: 30 }, (_, i) => ({
  id: `PROP-${String(11 + i).padStart(3, "0")}`,
  name: i >= names.length ? `${names[i % names.length]} II` : names[i],
  host: hosts[i % hosts.length],
  type: PROPERTY_TYPES[i % PROPERTY_TYPES.length],
  location: locations[i % locations.length],
  dateAdded: `2025-${pad(1 + (i % 4))}-${pad(1 + ((i * 5) % 28))}`,
  status: statusCycle[i % statusCycle.length],
  image: null,
}));

export const properties = [...seedProperties, ...generatedProperties];
