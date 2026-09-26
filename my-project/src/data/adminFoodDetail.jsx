import { foodVendors } from "@/data/adminFood";
import { applyStatusOverrides } from "@/data/adminStatusStore";

// Vendor detail, built from the SAME rows the admin Food Vendors list manages
// (src/data/adminFood.js), plus generated placeholders for everything the list
// doesn't track (about, menu, orders, documents, etc). Status changes made from
// the Food Vendors list or from this page's actions apply everywhere, since both
// read through applyStatusOverrides("food", ...).
// TODO: replace getFoodVendorDetail with GET /admin/food/:id/ once the backend exists.

const CATEGORY_DEFAULTS = {
  Restaurant: {
    hours: "8:00 AM - 10:00 PM (Daily)",
    about: (name) =>
      `${name} serves authentic Nigerian and local Abia dishes made with fresh, quality ingredients. We are passionate about great food, excellent service, and creating memorable dining experiences.`,
    menu: [
      { name: "Jollof Rice & Chicken", price: 2500 },
      { name: "Egusi Soup & Pounded Yam", price: 3000 },
      { name: "Suya (Skewers)", price: 1500 },
      { name: "Fried Rice & Chicken", price: 2800 },
    ],
  },
  "Fast Food": {
    hours: "9:00 AM - 9:00 PM (Daily)",
    about: (name) =>
      `${name} serves quick, tasty meals for people on the go, with fresh ingredients and fast service across Abia State.`,
    menu: [
      { name: "Chicken & Chips", price: 2000 },
      { name: "Beef Burger", price: 2200 },
      { name: "Shawarma", price: 1800 },
      { name: "Meat Pie (2pcs)", price: 800 },
    ],
  },
  Bakery: {
    hours: "7:00 AM - 7:00 PM (Daily)",
    about: (name) =>
      `${name} bakes fresh bread, pastries and cakes daily, using quality ingredients for every order.`,
    menu: [
      { name: "Meat Pie", price: 500 },
      { name: "Sliced Bread (Family)", price: 1500 },
      { name: "Chin Chin (Pack)", price: 1000 },
      { name: "Birthday Cake (Small)", price: 8000 },
    ],
  },
  Café: {
    hours: "8:00 AM - 8:00 PM (Daily)",
    about: (name) =>
      `${name} is a cozy spot for coffee, light meals and pastries, popular with students and professionals across Abia State.`,
    menu: [
      { name: "Cappuccino", price: 1500 },
      { name: "Club Sandwich", price: 2500 },
      { name: "Chicken Wrap", price: 2200 },
      { name: "Chocolate Cake Slice", price: 1800 },
    ],
  },
  "Food Vendor": {
    hours: "10:00 AM - 8:00 PM (Daily)",
    about: (name) =>
      `${name} is a local food vendor serving fresh, home-style meals to the community across Abia State.`,
    menu: [
      { name: "Rice & Stew", price: 1200 },
      { name: "Beans & Plantain", price: 1000 },
      { name: "Yam & Egg Sauce", price: 1300 },
      { name: "Moi Moi", price: 700 },
    ],
  },
  "Street Food": {
    hours: "4:00 PM - 12:00 AM (Daily)",
    about: (name) =>
      `${name} serves popular Abia street food favourites, freshly prepared and grilled to order.`,
    menu: [
      { name: "Suya (Beef)", price: 1500 },
      { name: "Roasted Corn & Pear", price: 500 },
      { name: "Boli & Fish", price: 1200 },
      { name: "Isi Ewu", price: 3500 },
    ],
  },
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const TIMES = [
  "9:15 AM",
  "10:30 AM",
  "11:00 AM",
  "2:15 PM",
  "3:45 PM",
  "5:20 PM",
];

const formatDate = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const numberFromId = (id) => parseInt(String(id).replace(/\D/g, ""), 10) || 1;
const naira = (n) => `₦${n.toLocaleString("en-US")}`;

// Hand-written details for specific vendors. Anything not listed here is generated.
const overrides = {
  "FOOD-001": {
    rating: 4.6,
    reviewCount: 124,
    phone: "+234 801 234 5678",
    email: "mamajskitchen@gmail.com",
    website: "www.mamajskitchen.com",
    about:
      "Mama J's Kitchen serves authentic Nigerian and local Abia dishes made with fresh, quality ingredients. We are passionate about great food, excellent service, and creating memorable dining experiences.",
    menu: [
      { name: "Jollof Rice & Chicken", price: 2500 },
      { name: "Egusi Soup & Pounded Yam", price: 3000 },
      { name: "Suya (Skewers)", price: 1500 },
      { name: "Fried Rice & Chicken", price: 2800 },
    ],
    orders: [
      {
        id: "o1",
        customer: "Chioma Nwosu",
        item: "Jollof Rice & Chicken",
        amount: 2500,
        date: "12 Apr 2025",
        status: "Completed",
      },
      {
        id: "o2",
        customer: "Emeka Okafor",
        item: "Egusi Soup & Pounded Yam",
        amount: 3000,
        date: "10 Apr 2025",
        status: "Completed",
      },
      {
        id: "o3",
        customer: "Blessing John",
        item: "Suya (Skewers)",
        amount: 1500,
        date: "8 Apr 2025",
        status: "Completed",
      },
    ],
    gallery: { thumbs: [null, null, null], extra: 6 },
    business: {
      name: "Mama J's Kitchen",
      type: "Restaurant",
      registrationNumber: "RC1234567",
      yearEstablished: "2020",
      website: "www.mamajskitchen.com",
      description:
        "Authentic Nigerian and local dishes made with fresh ingredients.",
    },
    documents: [
      {
        id: "d1",
        title: "Business Registration Certificate",
        status: "Verified",
      },
      {
        id: "d2",
        title: "Tax Identification Number (TIN)",
        status: "Verified",
      },
      { id: "d3", title: "Food Handler's Permit", status: "Verified" },
      { id: "d4", title: "Address Proof", status: "Verified" },
      { id: "d5", title: "Photos of Premises", status: "Verified" },
    ],
  },
  // Content from the "Pending Verification" mockup is applied here (FOOD-006,
  // an actual Pending vendor) rather than FOOD-001, which is Approved and
  // can't show both views at once. See chat note for why.
  "FOOD-006": {
    submittedAt: "12 Apr 2025, 10:24 AM",
    business: {
      name: "Mama T's Kitchen",
      type: "Restaurant",
      registrationNumber: "RC1234567",
      yearEstablished: "2020",
      website: "www.mamajskitchen.com",
      description:
        "Authentic Nigerian and local dishes made with fresh ingredients.",
    },
    documents: [
      {
        id: "d1",
        title: "Business Registration Certificate",
        status: "Verified",
      },
      {
        id: "d2",
        title: "Tax Identification Number (TIN)",
        status: "Verified",
      },
      { id: "d3", title: "Food Handler's Permit", status: "Verified" },
      { id: "d4", title: "Address Proof", status: "Verified" },
      { id: "d5", title: "Photos of Premises", status: "Verified" },
    ],
    checklist: [
      { id: "c1", label: "Business information verified", done: true },
      { id: "c2", label: "Documents verified", done: true },
      { id: "c3", label: "Photos verified", done: true },
      { id: "c4", label: "Location confirmed", done: true },
      { id: "c5", label: "Food safety compliance", done: true },
    ],
    gallery: { thumbs: [null, null, null, null, null], extra: 3 },
    previousActions: [
      {
        id: "a1",
        name: "Admin",
        avatar: null,
        text: "Vendor submitted for verification",
        date: "12 Apr 2025, 10:24 AM",
      },
    ],
  },
};

const buildDetail = (row) => {
  const n = numberFromId(row.id);
  const defaults =
    CATEGORY_DEFAULTS[row.category] || CATEGORY_DEFAULTS.Restaurant;

  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    category: row.category,
    location: `${row.location}, Abia State`,
    status: row.status,
    statusBeforeSuspend: row.statusBeforeSuspend ?? null,
    cover: row.image ?? null,
    logo: row.image ?? null,
    rating: Number((3.8 + ((n * 3) % 12) / 10).toFixed(1)),
    reviewCount: 15 + ((n * 11) % 180),
    about: defaults.about(row.name),
    hours: defaults.hours,
    phone: `+234 80${(n % 9) + 1} 234 56${String(n % 100).padStart(2, "0")}`,
    email: `${row.handle}@gmail.com`,
    website: `www.${row.handle}.com`,
    menu: defaults.menu,
    orders: [],
    gallery: { thumbs: [null, null, null], extra: 0 },
    map: { label: row.location },
    // Verification-view-only fields
    submittedAt: `${formatDate(row.dateAdded)}, ${TIMES[n % TIMES.length]}`,
    business: {
      name: row.name,
      type: row.category,
      registrationNumber: `RC${1000000 + n * 7331}`,
      yearEstablished: String(2015 + (n % 10)),
      website: `www.${row.handle}.com`,
      description: `Fresh, quality ${row.category.toLowerCase()} serving Abia State.`,
    },
    documents: [
      {
        id: "d1",
        title: "Business Registration Certificate",
        status: "Verified",
      },
      {
        id: "d2",
        title: "Tax Identification Number (TIN)",
        status: "Verified",
      },
      {
        id: "d3",
        title: "Food Handler's Permit",
        status: n % 4 === 0 ? "Pending" : "Verified",
      },
      { id: "d4", title: "Address Proof", status: "Verified" },
      { id: "d5", title: "Photos of Premises", status: "Verified" },
    ],
    checklist: [
      { id: "c1", label: "Business information verified", done: true },
      { id: "c2", label: "Documents verified", done: true },
      { id: "c3", label: "Photos verified", done: n % 3 !== 0 },
      { id: "c4", label: "Location confirmed", done: true },
      { id: "c5", label: "Food safety compliance", done: true },
    ],
    previousActions: [
      {
        id: "a1",
        name: "Admin",
        avatar: null,
        text: "Vendor submitted for verification",
        date: `${formatDate(row.dateAdded)}, ${TIMES[n % TIMES.length]}`,
      },
    ],
  };
};

// Returns the full detail object for a vendor id, or null if it doesn't exist.
export const getFoodVendorDetail = (id) => {
  const rows = applyStatusOverrides("food", foodVendors);
  const row = rows.find((v) => v.id === id);
  if (!row) return null;

  const merged = { ...buildDetail(row), ...overrides[id] };
  return {
    ...merged,
    business: { ...merged.business, ...(overrides[id]?.business || {}) },
  };
};
