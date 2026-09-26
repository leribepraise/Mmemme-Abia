import { events } from "./adminEvents";
import { organizers } from "./adminOrganizers";

// Detail data is built from the list row (title, organizer, location, date, status, category)
// plus deterministic placeholders for the rest, so every event gets a full page.
// TODO: replace getEventDetail with GET /admin/events/:id/ once the backend exists.

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

const TIMES = ["9:00 AM", "10:00 AM", "2:00 PM", "4:00 PM", "6:00 PM"];

// [min, max] ticket price in naira
const PRICE_BANDS = {
  Culture: [5000, 20000],
  Hospitality: [10000, 50000],
  "Food & Drink": [3000, 15000],
  Transport: [2000, 10000],
  Tourism: [5000, 25000],
  Entertainment: [5000, 30000],
};

const DESCRIPTIONS = {
  Culture: (t) =>
    `${t} celebrates the heritage, music and traditions of Abia State with performances, local cuisine and community activities.`,
  Hospitality: (t) =>
    `${t} brings guests together for an evening of fine hospitality, entertainment and networking in Abia State.`,
  "Food & Drink": (t) =>
    `${t} showcases the best of Abia's food and drink, with local vendors, tastings and live entertainment.`,
  Transport: (t) =>
    `${t} connects transport operators, drivers and travellers with the latest services and innovations in Abia State.`,
  Tourism: (t) =>
    `${t} invites visitors to explore the sights, history and natural beauty of Abia State with guided experiences.`,
  Entertainment: (t) =>
    `${t} is a night of live music, comedy and entertainment for audiences across Abia State.`,
};

const ORGANIZER_ABOUT = {
  Culture:
    "A cultural organization dedicated to promoting Abia's heritage, arts and tourism.",
  Hospitality:
    "A hospitality business offering comfortable stays and memorable experiences across Abia State.",
  "Food & Drink":
    "A food and drink business serving fresh, authentic Abia flavours.",
  Transport:
    "A transport company providing safe, reliable services across Abia State.",
  Tourism:
    "A tourism organizer offering guided tours and travel experiences across Abia State.",
  Entertainment:
    "An entertainment company producing live events and experiences across Abia State.",
};

// Hand-written details for specific events. Anything not listed here is generated.
// Image slots are null (placeholders render). Import real images from "@/assets/..."
// and set cover / gallery.thumbs here.
const overrides = {
  "EVT-001": {
    categoryLabel: "Festival",
    time: "10:00 AM",
    description:
      "The Abia Cultural Festival is a vibrant celebration of our rich heritage, music, food and traditions. Join us for a day of cultural performances, local cuisine, art exhibitions and community bonding.",
    expectedAttendees: "2,000+",
    contact: "+234 801 234 5678",
  },
};

const numberFromId = (id) => parseInt(String(id).replace(/\D/g, ""), 10) || 1;
const slug = (s) =>
  String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
const pad = (n) => String(n).padStart(2, "0");
const naira = (n) => `₦${n.toLocaleString("en-US")}`;

// "2025-01-12" -> "12 Jan 2025" (string split, so no timezone surprises)
const formatDate = (iso) => {
  const [y, m, d] = String(iso).split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
};

const buildDetail = (row) => {
  const n = numberFromId(row.id);
  const category = row.category;
  const [minPrice, maxPrice] = PRICE_BANDS[category] || [5000, 20000];
  const describe = DESCRIPTIONS[category] || DESCRIPTIONS.Culture;

  // Event rows only store the organizer's name, so match by name.
  // Punctuation and spacing are ignored ("TasteOfAbia" matches "Taste of Abia").
  const match = organizers.find((o) => slug(o.name) === slug(row.organizer));

  return {
    id: row.id,
    title: row.title,
    status: row.status,
    statusBeforeSuspend: null,
    category,
    categoryLabel: category,
    cover: row.image ?? null,
    location: `${row.location}, Abia State`,
    date: row.date,
    time: TIMES[n % TIMES.length],
    description: describe(row.title),
    expectedAttendees: `${(500 + ((n * 7) % 40) * 100).toLocaleString("en-US")}+`,
    ticketPrice: `${naira(minPrice)} - ${naira(maxPrice)}`,
    ageRestriction: n % 4 === 0 ? "18+" : "All Ages",
    website: `www.${slug(row.organizer)}.com`,
    contact: `+234 80${(n % 9) + 1} 234 56${pad(n % 100)}`,
    organizer: {
      name: row.organizer,
      // TODO: real verification state comes from the organizer record
      verified: match ? match.status === "Verified" : true,
      about: ORGANIZER_ABOUT[category] || ORGANIZER_ABOUT.Culture,
      avatar: match?.avatar ?? null,
      // Used by View Profile. null means no matching organizer page exists.
      organizerId: match?.id ?? null,
    },
    gallery: { thumbs: [null, null, null, null], extra: 5 },
  };
};

// Returns the full detail object for an event id, or null if it doesn't exist.
export const getEventDetail = (id) => {
  const row = events.find((e) => e.id === id);
  if (!row) return null;

  const merged = { ...buildDetail(row), ...overrides[id] };
  return {
    ...merged,
    dateTime: `${formatDate(merged.date)} • ${merged.time}`,
  };
};
