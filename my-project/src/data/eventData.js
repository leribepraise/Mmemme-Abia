import { load } from "../lib/utils";
import { seedEvents } from "./organizerData";

const BASE_PUBLIC_EVENTS = [
  {
    id: "south-east-migration-dialogue-26",
    image: "/image1.jpg",
    text: "South East Migration Dialogue 26",
    text2: "Umuahia, Abia",
    text3: "FREE",
  },

  {
    id: "jpi-state-youth-assembly",
    image: "/image2.jpg",
    text: "JPI State Youth Assembly",
    text2: "Umuahia, Abia",
    text3: "N5,000",
  },

  {
    id: "national-products-fair-2026",
    image: "/image3.jpg",
    text: "National Products Fair 2026",
    text2: "Umuahia, Abia",
    text3: "Free",
  },

  {
    id: "mr-&-miss-abia-colleges",
    image: "/image4.jpg",
    text: "Mr & Miss Abia Colleges",
    text2: "Aba, Abia",
    text3: "Free",
  },

  {
    id: "scars-that-speak",
    image: "/event5.jpg",
    text: "Scars that Speak",
    text2: "Aba, Abia",
    text3: "N2,000",
  },

  {
    id: "akwete-abia-fashion-and-fair-2026",
    image: "/event6.jpg",
    text: "Akwete Abia Fashion and Fair 2026",
    text2: "Umuahia, Abia",
    text3: "Free",
  },
];

export const toPublicEvent = (event) => {
  const title = event.title || event.text || "Untitled event";
  const venue = event.venue || event.text2 || "Abia State";
  const price = Number(event.price ?? 0);
  const date = event.date || "";
  const parsedDate = date ? new Date(`${date}T12:00:00`) : null;

  return {
    ...event,
    id: event.id,
    image: event.image || "/event.jpg",
    text: title,
    text2: venue,
    text3: event.text3 || (price > 0 ? `₦${price.toLocaleString("en-NG")}` : "Free"),
    dateDay: event.dateDay || (parsedDate ? String(parsedDate.getDate()).padStart(2, "0") : "28"),
    dateMonth:
      event.dateMonth ||
      (parsedDate
        ? parsedDate.toLocaleDateString("en-NG", { month: "short" }).toUpperCase()
        : "OCT"),
    description: event.description || "",
  };
};

export function getPublicEvents() {
  const storedEvents = load("mmemme-events", seedEvents);
  const published = storedEvents
    .filter((event) => event.status === "Published")
    .map(toPublicEvent);
  const byId = new Map(BASE_PUBLIC_EVENTS.map((event) => [event.id, event]));

  published.forEach((event) => {
    byId.set(event.id, event);
  });

  return [...byId.values()];
}

export function getPublicEventById(id) {
  return getPublicEvents().find((event) => event.id === id);
}

export const eventss = BASE_PUBLIC_EVENTS;
