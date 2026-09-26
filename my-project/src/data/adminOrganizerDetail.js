import { organizers } from "@/data/adminOrganizers";

// Detail data is built from the list row (name, handle, email, category, status, joined)
// plus generated placeholders for the rest, so every organizer gets a full profile.
// TODO: replace getOrganizerDetail with GET /admin/organizers/:id/ once the backend exists.

const CATEGORY_LABELS = {
  Events: "Events & Entertainment",
  Hotels: "Hotels & Stays",
  Transport: "Transport",
  Tourism: "Tourism",
  Food: "Food & Dining",
};

const BUSINESS_TYPES = {
  Events: "Event Organizer",
  Hotels: "Hotel & Accommodation",
  Transport: "Transport & Logistics",
  Tourism: "Tours & Travel",
  Food: "Restaurant & Catering",
};

const TAGLINES = {
  Events: "Memorable events and cultural experiences across Abia State.",
  Hotels: "Comfortable stays and warm hospitality across Abia State.",
  Transport: "Safe, reliable rides and transport services in Abia State.",
  Tourism: "Guided tours and travel experiences across Abia State.",
  Food: "Fresh, authentic Abia flavours, served with care.",
};

// [main count label, third card label]
const STAT_LABELS = {
  Events: ["Events Hosted", "Active Listings"],
  Hotels: ["Total Bookings", "Active Rooms"],
  Transport: ["Total Trips", "Active Vehicles"],
  Tourism: ["Total Bookings", "Active Tours"],
  Food: ["Total Orders", "Menu Items"],
};

const LOCATIONS = [
  "Umuahia, Abia State",
  "Aba, Abia State",
  "Arochukwu, Abia State",
  "Ohafia, Abia State",
  "Bende, Abia State",
  "Isiala Ngwa, Abia State",
];

const DEFAULT_ACTIVITIES = [
  {
    id: 1,
    title: "Updated business information",
    date: "20 Apr 2025, 10:24 AM",
    tone: "green",
  },
  {
    id: 2,
    title: "New booking received",
    date: "19 Apr 2025, 08:16 PM",
    tone: "blue",
  },
  {
    id: 3,
    title: "Responded to customer review",
    date: "18 Apr 2025, 04:32 PM",
    tone: "orange",
  },
  {
    id: 4,
    title: "Uploaded new documents",
    date: "16 Apr 2025, 11:20 AM",
    tone: "purple",
  },
];

// Hand-written details for specific organizers. Anything not listed here is generated.
// Image slots are null (placeholders render). Import real images from "@/assets/..."
// and set cover / thumbs here.
const overrides = {
  "ORG-002": {
    email: "info@okparahotels.com",
    phone: "+234 803 456 7890",
    location: "Umuahia, Abia State",
    tagline:
      "A premium hospitality experience in the heart of Abia State. Comfort, class and excellent service.",
    business: {
      registrationNumber: "RC1234567",
      yearEstablished: "2018",
      website: "www.okparahotels.com",
      description:
        "A premium hospitality experience in the heart of Abia State. Comfort, class and excellent service.",
    },
    stats: [
      {
        id: "count",
        label: "Total Bookings",
        value: 1248,
        kind: "number",
        note: "+18%",
        tone: "up",
      },
      {
        id: "revenue",
        label: "Total Revenue",
        value: 4230000,
        kind: "currency",
        note: "+112%",
        tone: "up",
      },
      {
        id: "active",
        label: "Active Rooms",
        value: 28,
        kind: "number",
        note: "-5%",
        tone: "down",
      },
      {
        id: "rating",
        label: "Rating",
        value: 4.5,
        kind: "rating",
        note: "(120 reviews)",
        tone: "muted",
      },
    ],
  },
};

const numberFromId = (id) => parseInt(id.replace(/\D/g, ""), 10) || 1;

const buildStats = (category, n) => {
  const [countLabel, activeLabel] = STAT_LABELS[category] || STAT_LABELS.Events;
  return [
    {
      id: "count",
      label: countLabel,
      value: 200 + ((n * 137) % 1300),
      kind: "number",
      note: "+18%",
      tone: "up",
    },
    {
      id: "revenue",
      label: "Total Revenue",
      value: 500000 + ((n * 373000) % 4500000),
      kind: "currency",
      note: "+12%",
      tone: "up",
    },
    {
      id: "active",
      label: activeLabel,
      value: 8 + ((n * 7) % 40),
      kind: "number",
      note: "-5%",
      tone: "down",
    },
    {
      id: "rating",
      label: "Rating",
      value: Number((3.6 + ((n * 3) % 14) / 10).toFixed(1)),
      kind: "rating",
      note: `(${20 + ((n * 11) % 180)} reviews)`,
      tone: "muted",
    },
  ];
};

const buildDetail = (row) => {
  const n = numberFromId(row.id);
  const tagline = TAGLINES[row.category] || TAGLINES.Events;
  const site = row.handle.replace(/[^a-z0-9]/gi, "").toLowerCase();

  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    avatar: row.avatar,
    category: CATEGORY_LABELS[row.category] || row.category,
    status: row.status,
    joined: row.joined,
    tagline,
    email: row.email,
    phone: `+234 80${(n % 9) + 1} 456 78${String(n % 100).padStart(2, "0")}`,
    location: LOCATIONS[n % LOCATIONS.length],
    business: {
      name: row.name,
      type: BUSINESS_TYPES[row.category] || "Business",
      registrationNumber: `RC${1000000 + n * 7331}`,
      yearEstablished: String(2012 + (n % 10)),
      website: `www.${site}.com`,
      description: tagline,
    },
    stats: buildStats(row.category, n),
    activities: DEFAULT_ACTIVITIES,
    gallery: { cover: null, thumbs: [null, null, null, null] },
  };
};

// Returns the full detail object for an organizer id, or null if it doesn't exist.
export const getOrganizerDetail = (id) => {
  const row = organizers.find((o) => o.id === id);
  if (!row) return null;

  const base = buildDetail(row);
  const extra = overrides[id];
  if (!extra) return base;

  return {
    ...base,
    ...extra,
    business: { ...base.business, ...extra.business },
  };
};
