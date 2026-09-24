import { tours } from "./tours";
import { eventss } from "./eventData";
import { hotels } from "./hotels";

const parsePrice = (text3) => {
  if (!text3) return 0;
  if (text3.toLowerCase() === "free") return 0;
  const digitsOnly = text3.replace(/[^0-9]/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
};

export const buildSearchIndex = () => {
  const placeResults = tours.map((t) => ({
    id: t.id,
    type: "place",
    category: "Tourism",
    name: t.name,
    location: t.location,
    rating: t.rating,
    reviews: t.reviews,
    categoryLabel: t.text2,
    description: t.description || "",
    image: t.image,
    price: 0,
    to: `/destinations/${t.id}`,
  }));

  const eventResults = eventss.map((e) => ({
    id: e.id,
    type: "event",
    category: "Events",
    name: e.text,
    location: e.text2,
    date: e.date || "",
    categoryLabel: e.category || "Event",
    description: e.description || "",
    image: e.image,
    price: parsePrice(e.text3),
    to: `/events/${e.id}`,
  }));

  const hotelResults = hotels.map((h) => ({
    id: h.id,
    type: "place",
    category: "Stay",
    name: h.name,
    location: h.location,
    rating: h.rating,
    reviews: h.reviews,
    categoryLabel: "Hotel",
    description: "",
    image: h.image,
    price: h.price || 0,
    to: `/hotels/${h.id}`,
  }));

  return [...placeResults, ...eventResults, ...hotelResults];
};
