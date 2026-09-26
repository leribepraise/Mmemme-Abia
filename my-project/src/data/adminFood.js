import { Archive, CheckCircle2, Clock, XCircle } from "lucide-react";

export const ALL_STATUSES = "All Status";
export const ALL_CATEGORIES = "All Categories";

export const FOOD_STATUSES = ["Approved", "Pending", "Suspended", "Rejected"];

export const FOOD_CATEGORIES = [
  "Restaurant",
  "Food Vendor",
  "Bakery",
  "Café",
  "Fast Food",
  "Street Food",
];

// Pill labels differ slightly from the raw category values (grouped/plural),
// so this maps each pill to the category values it should filter for.
export const FOOD_CATEGORY_PILLS = [
  { label: "All", categories: null },
  { label: "Restaurants", categories: ["Restaurant"] },
  { label: "Food Vendors", categories: ["Food Vendor"] },
  { label: "Cafes & Bakeries", categories: ["Café", "Bakery"] },
  { label: "Fast Food", categories: ["Fast Food"] },
  { label: "Street Food", categories: ["Street Food"] },
];

// Platform-wide totals (static until the backend exists)
export const foodStats = [
  {
    id: "total",
    label: "Total Vendors",
    value: "104",
    change: "+12%",
    icon: Archive,
    iconBox: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "pending",
    label: "Pending",
    value: "18",
    change: "-4%",
    icon: Clock,
    iconBox: "bg-amber-50 text-[#f28c28]",
  },
  {
    id: "approved",
    label: "Approved",
    value: "82",
    change: "+15%",
    icon: CheckCircle2,
    iconBox: "bg-emerald-50 text-emerald-600",
  },
  {
    id: "rejected",
    label: "Rejected",
    value: "4",
    change: "-2%",
    icon: XCircle,
    iconBox: "bg-red-50 text-red-500",
  },
];

// Dates are ISO strings (YYYY-MM-DD) so a future date-range filter can compare them
const seedVendors = [
  {
    id: "FOOD-001",
    name: "Mama J's Kitchen",
    handle: "mamajskitchen",
    category: "Restaurant",
    location: "Umuahia",
    dateAdded: "2025-04-12",
    status: "Approved",
    image: null,
  },
  {
    id: "FOOD-002",
    name: "The Local Bites",
    handle: "thelocalbites",
    category: "Fast Food",
    location: "Aba",
    dateAdded: "2025-04-10",
    status: "Approved",
    image: null,
  },
  {
    id: "FOOD-003",
    name: "Sweet Delights",
    handle: "sweetdelights",
    category: "Bakery",
    location: "Umuahia",
    dateAdded: "2025-04-08",
    status: "Pending",
    image: null,
  },
  {
    id: "FOOD-004",
    name: "Chop Life",
    handle: "choplifeabia",
    category: "Restaurant",
    location: "Aba",
    dateAdded: "2025-04-06",
    status: "Approved",
    image: null,
  },
  {
    id: "FOOD-005",
    name: "Foodie Hub",
    handle: "foodiehub",
    category: "Café",
    location: "Umuahia",
    dateAdded: "2025-04-04",
    status: "Approved",
    image: null,
  },
  {
    id: "FOOD-006",
    name: "Mama T's Kitchen",
    handle: "mamatskitchen",
    category: "Restaurant",
    location: "Aba",
    dateAdded: "2025-04-02",
    status: "Pending",
    image: null,
  },
  {
    id: "FOOD-007",
    name: "Grill Spot",
    handle: "grillspot",
    category: "Fast Food",
    location: "Ohafia",
    dateAdded: "2025-03-28",
    status: "Approved",
    image: null,
  },
  {
    id: "FOOD-008",
    name: "Delicious Bites",
    handle: "deliciousbites",
    category: "Food Vendor",
    location: "Umuahia",
    dateAdded: "2025-03-25",
    status: "Rejected",
    image: null,
  },
  {
    id: "FOOD-009",
    name: "The Cake Studio",
    handle: "thecakestudio",
    category: "Bakery",
    location: "Aba",
    dateAdded: "2025-03-20",
    status: "Approved",
    image: null,
  },
  {
    id: "FOOD-010",
    name: "Naija Suya Spot",
    handle: "naijasuya",
    category: "Street Food",
    location: "Umuahia",
    dateAdded: "2025-03-18",
    status: "Pending",
    image: null,
  },
];

// Extra generated vendors so search, filters and pagination have something to work with
const names = [
  "Ariaria Food Court",
  "Umuahia Smokehouse",
  "Ngwa Kitchen Table",
  "Bende Bakery House",
  "Abia Spice Route",
  "Ohafia Café Corner",
  "Aba Grill Junction",
  "Isiala Street Eats",
  "Umuahia Pastry Bar",
  "Abia Fresh Kitchen",
  "Ikwuano Food Stop",
  "Osisioma Delicacies",
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
const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const generatedVendors = Array.from({ length: 24 }, (_, i) => {
  const name = i >= names.length ? `${names[i % names.length]} II` : names[i];
  return {
    id: `FOOD-${String(11 + i).padStart(3, "0")}`,
    name,
    handle: slug(name),
    category: FOOD_CATEGORIES[i % FOOD_CATEGORIES.length],
    location: locations[i % locations.length],
    dateAdded: `2025-${pad(1 + (i % 4))}-${pad(1 + ((i * 5) % 28))}`,
    status: statusCycle[i % statusCycle.length],
    image: null,
  };
});

export const foodVendors = [...seedVendors, ...generatedVendors];
