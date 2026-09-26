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

const idNumber = (id) => parseInt(String(id).replace(/\D/g, ""), 10) || 0;

// The ONE place that maps an organizer to what the approval screen shows.
// Reads organizer.business first, then the organizer itself.
// If a field shows "—", add the real key name to its list below.
export const toApprovalInfo = (o) => {
  const b = o.business ?? {};
  const pick = (keys, fallback = "—") => {
    for (const source of [b, o]) {
      for (const key of keys) {
        const value = source[key];
        if (value !== undefined && value !== null && value !== "") return value;
      }
    }
    return fallback;
  };

  const handle = String(o.handle ?? "");
  const type = pick(["type", "businessType", "category"]);

  // No eventsCount key exists on the detail object, so fall back to the
  // "count" stat card (Events Hosted / Total Bookings / Total Trips, by category).
  const countStat = Array.isArray(o.stats)
    ? o.stats.find((s) => s.id === "count")
    : null;

  return {
    name: o.name,
    handle: handle.startsWith("@") ? handle : `@${handle}`,
    email: o.email,
    phone: pick(["phone", "phoneNumber"]),
    location: pick(["location", "lga", "city", "address"]),
    avatar: o.avatar ?? null,
    eventsCount: o.eventsCount ?? countStat?.value ?? 0,
    businessName: pick(["businessName", "name"], o.name),
    businessType: type,
    registrationNumber: pick([
      "registrationNumber",
      "regNumber",
      "regNo",
      "registration",
    ]),
    yearEstablished: pick(["yearEstablished", "established", "year"]),
    website: pick(["website", "url"]),
    description: pick(
      ["description", "about"],
      `${pick(["businessName", "name"], o.name)} is a ${String(
        type === "—" ? "business" : type,
      ).toLowerCase()} serving Abia State.`,
    ),
  };
};

const DOCUMENT_TITLES = [
  "Business Registration Certificate",
  "ID Card",
  "Business Permit",
  "Profile Photo",
];

// `key` picks the icon in ApprovalVerification.jsx
const VERIFICATION = [
  { key: "business", label: "Business Information", done: true },
  { key: "identification", label: "Identification Document", done: true },
  { key: "address", label: "Address Verification", done: true },
  { key: "photo", label: "Profile Photo", done: true },
  { key: "bank", label: "Bank Account", done: false },
  { key: "additional", label: "Additional Documents", done: false },
];

// Deterministic placeholders. TODO: replace with the backend response.
export const getApprovalExtras = (organizer) => {
  const n = idNumber(organizer.id);
  const day = 1 + ((n * 3) % 25);
  const month = MONTHS[3 + (n % 3)];
  const at = (offset, time) => `${day + offset} ${month} 2025, ${time}`;

  return {
    documents: DOCUMENT_TITLES.map((title, i) => ({ id: i + 1, title })),
    verification: VERIFICATION,
    timeline: [
      { id: 1, title: "Account Created", date: at(0, "09:12 AM") },
      { id: 2, title: "Profile Completed", date: at(1, "02:34 PM") },
      { id: 3, title: "Documents Submitted", date: at(2, "11:20 AM") },
    ],
  };
};
