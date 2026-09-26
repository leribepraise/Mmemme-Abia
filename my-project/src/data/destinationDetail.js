import { tourismListings } from "@/data/adminTourism";
import { applyStatusOverrides } from "@/data/adminStatusStore";

// Public/admin destination detail, built from the SAME rows the admin Tourism
// Listings page manages (src/data/adminTourism.js), plus generated placeholders
// for everything the admin list doesn't track (about text, hours, reviews,
// submitter info, uploaded media, etc). Status changes made in admin
// (approve/reject/suspend, or from the approval view itself) apply here too,
// since both read through applyStatusOverrides("tourism", ...).
// TODO: replace getDestinationDetail with GET /destinations/:id/ once the backend exists.

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

const CATEGORY_DEFAULTS = {
  "Nature & Parks": {
    highlights: [
      "Nature trails and guided tours",
      "Rich biodiversity and wildlife",
      "Photography spots",
      "Picnic areas",
    ],
    hours: "6:00 AM - 6:00 PM (Daily)",
    entryFee: "₦1,000 per person",
    about: (name) =>
      `${name} is a lush, scenic natural site known for its rich biodiversity, peaceful environment and beautiful trails. It's a perfect destination for nature lovers, researchers, and adventure seekers who want to explore Abia's natural beauty.`,
  },
  "Historical Sites": {
    highlights: [
      "Guided historical tours",
      "Preserved artifacts and exhibits",
      "Photography spots",
      "Souvenir shop on site",
    ],
    hours: "9:00 AM - 5:00 PM (Tue - Sun)",
    entryFee: "₦500 per person",
    about: (name) =>
      `${name} preserves a piece of Abia State's history, offering guided tours and exhibits for visitors of all ages.`,
  },
  "Caves & Hills": {
    highlights: [
      "Guided cave and hill tours",
      "Scenic viewpoints",
      "Photography spots",
      "Moderate hiking trails",
    ],
    hours: "7:00 AM - 5:00 PM (Daily)",
    entryFee: "₦800 per person",
    about: (name) =>
      `${name} offers a scenic escape with guided tours through caves and hills, popular with hikers and photographers alike.`,
  },
  "Religious Sites": {
    highlights: [
      "Guided site tours",
      "Historical significance",
      "Photography spots (select areas)",
      "Quiet reflection areas",
    ],
    hours: "8:00 AM - 6:00 PM (Daily)",
    entryFee: "Free entry",
    about: (name) =>
      `${name} is a place of worship and historical significance, welcoming visitors seeking reflection and cultural insight.`,
  },
  "Adventure Sites": {
    highlights: [
      "Guided adventure tours",
      "Adrenaline activities",
      "Photography spots",
      "Rest and refreshment areas",
    ],
    hours: "8:00 AM - 6:00 PM (Daily)",
    entryFee: "₦1,500 per person",
    about: (name) =>
      `${name} is an adventure destination offering guided activities and scenic thrills for visitors across Abia State.`,
  },
};

// Generated placeholder submitters, since the admin Tourism list doesn't
// track who added each listing. TODO: replace with the real submitter once
// the backend tracks this per listing.
const SUBMITTERS = [
  { name: "Uchenna Nwosu", business: "Green Tourism Ventures" },
  { name: "Ifeoma Chukwu", business: "Abia Heritage Trust" },
  { name: "Emeka Obi", business: "Ngwa Nature Collective" },
  { name: "Ngozi Adiele", business: "Umuahia Explorers" },
  { name: "Kelechi Ude", business: "Abia Trails Co" },
];

// Hand-written details for specific destinations. Anything not listed here is
// generated from the category defaults / generators below. Image slots are
// null (placeholders render) until real images are set.
const overrides = {
  "TOU-001": {
    rating: 4.6,
    reviewCount: 124,
    about:
      "Osisioma Forest Reserve is a lush, scenic forest known for its rich biodiversity, peaceful environment and beautiful nature trails. It's a perfect destination for nature lovers, researchers, and adventure seekers who want to explore Abia's natural beauty.",
    gallery: { thumbs: [null, null], extra: 6 },
    reviews: [
      {
        id: 1,
        name: "Chinedu Okafor",
        avatar: null,
        rating: 5,
        timeAgo: "2 days ago",
        text: "A beautiful and peaceful place. The trails are well maintained and the view is amazing. Highly recommended!",
      },
    ],
  },
  "TOU-002": {
    submittedAt: "10 Apr 2025, 3:45 PM",
    addedBy: {
      name: "Uchenna Nwosu",
      business: "Green Tourism Ventures",
      verified: true,
      avatar: null,
      email: "uchennanwosu@gmail.com",
      phone: "+234 803 456 7890",
    },
    media: { thumbs: [null, null, null, null], extra: 3 },
    comments: [
      {
        id: "c1",
        name: "Admin",
        avatar: null,
        date: "10 Apr 2025, 2:15 PM",
        text: "Please verify the entry fee and add more photos of the facilities.",
      },
    ],
  },
};

const numberFromId = (id) => parseInt(String(id).replace(/\D/g, ""), 10) || 1;

// "2025-04-12" -> "12 Apr 2025" (string split, so no timezone surprises)
const formatDate = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const buildDetail = (row) => {
  const n = numberFromId(row.id);
  const defaults =
    CATEGORY_DEFAULTS[row.category] || CATEGORY_DEFAULTS["Nature & Parks"];
  const submitter = SUBMITTERS[n % SUBMITTERS.length];

  return {
    id: row.id,
    name: row.name,
    category: row.category,
    location: `${row.location}, Abia State`,
    status: row.status,
    statusBeforeSuspend: row.statusBeforeSuspend ?? null,
    cover: row.image ?? null,
    rating: Number((3.8 + ((n * 3) % 12) / 10).toFixed(1)),
    reviewCount: 15 + ((n * 11) % 180),
    about: defaults.about(row.name),
    highlights: defaults.highlights,
    hours: defaults.hours,
    entryFee: defaults.entryFee,
    gallery: { thumbs: [null, null], extra: 0 },
    map: { label: row.location },
    reviews: [],
    // Approval-view-only fields
    submittedAt: `${formatDate(row.dateAdded)}, ${TIMES[n % TIMES.length]}`,
    addedBy: {
      name: submitter.name,
      business: submitter.business,
      verified: n % 3 !== 0,
      avatar: null,
      email: `${submitter.name.toLowerCase().replace(/\s+/g, "")}@gmail.com`,
      phone: `+234 80${(n % 9) + 1} 456 78${String(n % 100).padStart(2, "0")}`,
    },
    media: { thumbs: [null, null, null, null], extra: 0 },
    comments: [],
  };
};

// Returns the full detail object for a destination id, or null if it doesn't exist.
export const getDestinationDetail = (id) => {
  // Apply any admin status overrides first, so this always reflects what
  // the Tourism Listings page shows (approve/reject/suspend stay in sync).
  const rows = applyStatusOverrides("tourism", tourismListings);
  const row = rows.find((t) => t.id === id);
  if (!row) return null;

  return { ...buildDetail(row), ...overrides[id] };
};
