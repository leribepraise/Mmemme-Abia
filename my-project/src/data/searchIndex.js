const parsePrice = (text3) => {
  if (!text3) return 0;
  if (text3.toLowerCase() === "free") return 0;
  const digitsOnly = text3.replace(/[^0-9.]/g, "");
  return digitsOnly ? Number(digitsOnly) : 0;
};

export const buildSearchIndex = ({ tours = [], eventss = [], hotels = [], restaurants = [], menu = [] } = {}) => {
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
    priceLabel: "See tour options",
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
    priceLabel: h.price == null ? "See availability" : null,
    to: `/hotels/${h.id}`,
  }));

  const restaurantResults = restaurants.map(row => ({ id: `restaurant-${row.id}`, type: 'place', category: 'Restaurants', name: row.name, location: row.city, categoryLabel: 'Restaurant', description: row.description, image: row.image || '/food1.jpg', price: 0, priceLabel: 'See menu', to: `/fooddetail/${row.id}` }));
  const dishResults = menu.map(row => ({ id: `dish-${row.id}`, type: 'place', category: 'Restaurants', name: row.name, location: restaurants.find(restaurant => restaurant.id === row.restaurant)?.city || '', categoryLabel: 'Food', description: row.description, image: row.image || '/food1.jpg', price: Number(row.price), to: `/fooddetail/${row.restaurant}` }));
  return [...placeResults, ...eventResults, ...hotelResults, ...restaurantResults, ...dishResults];
};
