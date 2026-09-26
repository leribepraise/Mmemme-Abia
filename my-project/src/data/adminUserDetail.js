import { initialUsers } from "@/data/adminUsers";

// Shown as "USR-0001" etc. The Users table row ids stay numeric (single ID scheme).
export const formatUserId = (id) => `USR-${String(id).padStart(4, "0")}`;

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
const STREETS = [
  "Peace Lane",
  "Library Avenue",
  "Azikiwe Road",
  "Factory Road",
  "Market Road",
  "Ikot Ekpene Road",
];
const PLANS = ["Silver", "Gold", "Basic"];
const FEMALE_FIRST_NAMES = [
  "Ngozi",
  "Blessing",
  "Adaeze",
  "Felicia",
  "Chioma",
  "Amaka",
  "Ijeoma",
  "Nneka",
  "Ada",
  "Oluchi",
];

const pad = (n) => String(n).padStart(2, "0");
const day = (n) => 1 + (n % 28);
const shortDate = (n, monthIndex) => `${day(n)} ${MONTHS[monthIndex]} 2025`;

// Deterministic placeholders so the same user always shows the same profile.
// These all disappear once GET /admin/users/:id/ exists.
const buildGenerated = (row) => {
  const n = Number(row.id) || 0;
  const firstName = row.name.split(" ")[0];
  const scale = (amount) => Math.round(amount * (1 + (n % 3) * 0.25));

  const joined = shortDate(n * 7, n % 6);
  const lastLogin = `${day(n * 3)} ${MONTHS[6 + (n % 3)]} 2025, ${pad(
    1 + (n % 12),
  )}:${pad((n * 17) % 60)} ${n % 2 ? "AM" : "PM"}`;

  return {
    avatar: null,
    whatsapp: row.phone,
    dob: `${day(n * 5)} ${MONTHS[(n * 7) % 12]} ${1980 + ((n * 3) % 25)}`,
    gender: FEMALE_FIRST_NAMES.includes(firstName) ? "Female" : "Male",
    address: `${1 + ((n * 7) % 60)} ${STREETS[n % STREETS.length]}, ${row.lga}, Abia State`,
    joined,
    lastLogin,
    subscription: {
      plan: PLANS[n % PLANS.length],
      expires: shortDate(n * 2, 6 + (n % 6)),
    },
    bookings: [
      {
        id: 1,
        type: "hotel",
        title: "Hotel - The Green Park Hotel",
        date: shortDate(n + 24, 3),
        amount: scale(45000),
        status: "Confirmed",
      },
      {
        id: 2,
        type: "event",
        title: "Event - Abia Cultural Festival",
        date: shortDate(n + 14, 3),
        amount: scale(12000),
        status: "Confirmed",
      },
      {
        id: 3,
        type: "transport",
        title: "Transport - Ride",
        date: shortDate(n + 9, 3),
        amount: scale(5000),
        status: "Completed",
      },
    ],
    payments: [
      {
        id: 1,
        type: "card",
        title: "Hotel Booking",
        date: shortDate(n + 19, 3),
        amount: scale(45000),
        status: "Success",
      },
      {
        id: 2,
        type: "ticket",
        title: "Event Ticket",
        date: shortDate(n + 14, 3),
        amount: scale(12000),
        status: "Success",
      },
      {
        id: 3,
        type: "transport",
        title: "Transport Ride",
        date: shortDate(n + 9, 3),
        amount: scale(5000),
        status: "Success",
      },
    ],
    activities: [
      {
        id: 1,
        title: "User registered on Mmemme Abia",
        date: `${joined}, 09:15 AM`,
      },
      {
        id: 2,
        title: "Booked a hotel",
        date: `${shortDate(n + 19, 3)}, 02:15 PM`,
      },
      {
        id: 3,
        title: "Made a payment",
        date: `${shortDate(n + 9, 3)}, 02:16 PM`,
      },
      { id: 4, title: "Logged in", date: lastLogin },
    ],
  };
};

// Hand-written profiles that match the screenshots, keyed by row id.
// Anything you don't override is generated from the row above.
const overrides = {
  1: {
    whatsapp: "+234 810 123 4567",
    dob: "15 Mar 1995",
    gender: "Male",
    address: "12 Peace Lane, Umuahia, Abia State",
    joined: "12 Jan 2025",
    lastLogin: "26 Apr 2025, 10:24 AM",
    subscription: { plan: "Silver", expires: "12 Jun 2025" },
    bookings: [
      {
        id: 1,
        type: "hotel",
        title: "Hotel - The Green Park Hotel",
        date: "25 Apr 2025",
        amount: 45000,
        status: "Confirmed",
      },
      {
        id: 2,
        type: "event",
        title: "Event - Abia Cultural Festival",
        date: "15 Apr 2025",
        amount: 12000,
        status: "Confirmed",
      },
      {
        id: 3,
        type: "transport",
        title: "Transport - Ride",
        date: "10 Apr 2025",
        amount: 5000,
        status: "Completed",
      },
    ],
    payments: [
      {
        id: 1,
        type: "card",
        title: "Hotel Booking",
        date: "20 Apr 2025",
        amount: 45000,
        status: "Success",
      },
      {
        id: 2,
        type: "ticket",
        title: "Event Ticket",
        date: "15 Apr 2025",
        amount: 12000,
        status: "Success",
      },
      {
        id: 3,
        type: "transport",
        title: "Transport Ride",
        date: "10 Apr 2025",
        amount: 5000,
        status: "Success",
      },
    ],
    activities: [
      {
        id: 1,
        title: "User registered on Mmemme Abia",
        date: "12 Jan 2025, 09:15 AM",
      },
      { id: 2, title: "Booked a hotel", date: "20 Apr 2025, 02:15 PM" },
      { id: 3, title: "Made a payment", date: "10 Apr 2025, 02:16 PM" },
      { id: 4, title: "Logged in", date: "26 Apr 2025, 10:24 AM" },
    ],
  },
};

// Single source of truth: the Users table rows. Returns null for an unknown id.
export const getUserDetail = (id) => {
  const row = initialUsers.find((u) => String(u.id) === String(id));
  if (!row) return null;

  return {
    id: formatUserId(row.id),
    name: row.name,
    email: row.email,
    phone: row.phone,
    role: row.role,
    lga: row.lga,
    status: row.status,
    ...buildGenerated(row),
    ...overrides[row.id],
  };
};
