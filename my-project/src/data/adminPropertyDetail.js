import { properties } from "@/data/adminProperties";
import { applyStatusOverrides } from "@/data/adminStatusStore";

// Property detail, built from the SAME rows the admin Properties list manages
// (src/data/adminProperties.js), plus generated placeholders for everything the
// list doesn't track (amenities, rooms, documents, reviews, etc). Status
// changes made from the Properties list or from this page's actions apply
// everywhere, since both read through applyStatusOverrides("properties", ...).
// TODO: replace getPropertyDetail with GET /admin/properties/:id/ once the backend exists.

const TYPE_DEFAULTS = {
  Hotel: {
    amenities: [
      "Free Wi-Fi",
      "Parking",
      "Restaurant",
      "Swimming Pool",
      "24/7 Front Desk",
    ],
    highlights: [
      "Luxury Rooms",
      "Complimentary Breakfast",
      "Swimming Pool",
      "Gym & Fitness",
      "Free Wi-Fi",
      "Conference Hall",
    ],
    about: (name) =>
      `${name} offers a perfect blend of comfort, luxury and modern amenities. Designed for both business and leisure travelers, with excellent service and world-class facilities.`,
    rooms: [
      { name: "Standard Rooms", price: 45000, guests: 2, beds: 1 },
      { name: "Deluxe Room", price: 65000, guests: 2, beds: 1 },
      { name: "Executive Suite", price: 95000, guests: 4, beds: 2 },
    ],
  },
  Hostel: {
    amenities: [
      "Free Wi-Fi",
      "Shared Kitchen",
      "Laundry",
      "Lockers",
      "24/7 Front Desk",
    ],
    highlights: [
      "Shared Dorms",
      "Free Wi-Fi",
      "Common Lounge",
      "Laundry Service",
      "Lockers",
      "Kitchen Access",
    ],
    about: (name) =>
      `${name} is a budget-friendly stay offering clean, shared accommodation with a social atmosphere, ideal for travelers exploring Abia State.`,
    rooms: [
      { name: "Shared Dorm (4 Bed)", price: 8000, guests: 1, beds: 1 },
      { name: "Shared Dorm (2 Bed)", price: 12000, guests: 1, beds: 1 },
      { name: "Private Room", price: 20000, guests: 2, beds: 1 },
    ],
  },
  "Short-Stay": {
    amenities: [
      "Free Wi-Fi",
      "Kitchenette",
      "Parking",
      "Air Conditioning",
      "Self Check-in",
    ],
    highlights: [
      "Fully Furnished",
      "Kitchenette",
      "Free Wi-Fi",
      "Air Conditioning",
      "Self Check-in",
      "Parking",
    ],
    about: (name) =>
      `${name} offers a fully furnished short-stay apartment, ideal for business trips or weekend getaways in Abia State.`,
    rooms: [
      { name: "Studio Apartment", price: 25000, guests: 2, beds: 1 },
      { name: "1 Bedroom Apartment", price: 35000, guests: 3, beds: 1 },
      { name: "2 Bedroom Apartment", price: 55000, guests: 5, beds: 2 },
    ],
  },
};

// Hand-written details for specific properties. Anything not listed here is
// generated. Image slots are null (placeholders render) until real images
// are set.
const overrides = {
  "PROP-001": {
    rating: 4.8,
    reviewCount: 124,
    distanceFromCenter: "2.5 km from city center",
    carousel: [null, null, null, null, null],
    galleryExtra: 6,
    reviews: [
      {
        id: 1,
        name: "Chinedu Okafor",
        avatar: null,
        rating: 5,
        timeAgo: "3 days ago",
        text: "Beautiful hotel with excellent service. The rooms are clean and spacious.",
      },
    ],
  },
  "PROP-002": {
    submittedAt: "12 Apr 2025, 10:24 AM",
    contact: "+234 810 123 4567",
    email: "info@whitehillresort.com",
    documents: [
      {
        id: "d1",
        title: "Business Registration Certificate",
        kind: "pdf",
        size: "2.4 MB",
        status: "Verified",
      },
      {
        id: "d2",
        title: "Tax Identification Number (TIN)",
        kind: "pdf",
        size: "1.1 MB",
        status: "Verified",
      },
      {
        id: "d3",
        title: "Property Ownership Document",
        kind: "pdf",
        size: "3.2 MB",
        status: "Verified",
      },
      {
        id: "d4",
        title: "Owner's ID Card",
        kind: "image",
        size: "1.4 MB",
        status: "Verified",
      },
      {
        id: "d5",
        title: "Property Photos",
        kind: "image",
        size: "5 Images • 4.8 MB",
        status: "Verified",
      },
      {
        id: "d6",
        title: "Health & Safety Certificate",
        kind: "pdf",
        size: "1.2 MB",
        status: "Pending",
      },
    ],
    checklist: [
      { id: "c1", label: "Business information verified", done: true },
      { id: "c2", label: "Documents are valid", done: true },
      { id: "c3", label: "Property exists at location", done: true },
      { id: "c4", label: "Photos match property", done: true },
      { id: "c5", label: "No reported issues", done: true },
    ],
  },
};

const numberFromId = (id) => parseInt(String(id).replace(/\D/g, ""), 10) || 1;
const naira = (n) => `₦${n.toLocaleString("en-US")}`;

const buildDetail = (row) => {
  const n = numberFromId(row.id);
  const defaults = TYPE_DEFAULTS[row.type] || TYPE_DEFAULTS.Hotel;

  return {
    id: row.id,
    name: row.name,
    host: row.host,
    hostVerified: n % 3 !== 0,
    type: row.type,
    location: `${row.location}, Abia State`,
    status: row.status,
    statusBeforeSuspend: row.statusBeforeSuspend ?? null,
    cover: row.image ?? null,
    carousel: [null, null, null],
    galleryExtra: 0,
    rating: Number((3.8 + ((n * 3) % 12) / 10).toFixed(1)),
    reviewCount: 15 + ((n * 11) % 180),
    distanceFromCenter: `${1 + (n % 8)}.${n % 10} km from city center`,
    amenities: defaults.amenities,
    highlights: defaults.highlights,
    about: defaults.about(row.name),
    rooms: defaults.rooms.map((r, i) => ({ id: `${row.id}-room-${i}`, ...r })),
    reviews: [],
    map: { label: row.location },
    // Verification-view-only fields
    submittedAt: `${row.dateAdded.split("-").reverse().join("/")}`,
    contact: `+234 8${(n % 9) + 1}0 ${String(100 + (n % 900)).padStart(3, "0")} ${String(1000 + (n % 9000)).padStart(4, "0")}`,
    email: `info@${row.host.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
    documents: [
      {
        id: "d1",
        title: "Business Registration Certificate",
        kind: "pdf",
        size: "2.1 MB",
        status: "Verified",
      },
      {
        id: "d2",
        title: "Tax Identification Number (TIN)",
        kind: "pdf",
        size: "0.9 MB",
        status: "Verified",
      },
      {
        id: "d3",
        title: "Property Ownership Document",
        kind: "pdf",
        size: "2.8 MB",
        status: "Verified",
      },
      {
        id: "d4",
        title: "Owner's ID Card",
        kind: "image",
        size: "1.2 MB",
        status: "Verified",
      },
      {
        id: "d5",
        title: "Property Photos",
        kind: "image",
        size: "4 Images • 3.9 MB",
        status: "Verified",
      },
      {
        id: "d6",
        title: "Health & Safety Certificate",
        kind: "pdf",
        size: "1.0 MB",
        status: "Pending",
      },
    ],
    checklist: [
      { id: "c1", label: "Business information verified", done: true },
      { id: "c2", label: "Documents are valid", done: true },
      { id: "c3", label: "Property exists at location", done: n % 4 !== 0 },
      { id: "c4", label: "Photos match property", done: true },
      { id: "c5", label: "No reported issues", done: true },
    ],
  };
};

// Returns the full detail object for a property id, or null if it doesn't exist.
export const getPropertyDetail = (id) => {
  const rows = applyStatusOverrides("properties", properties);
  const row = rows.find((p) => p.id === id);
  if (!row) return null;

  return { ...buildDetail(row), ...overrides[id] };
};
