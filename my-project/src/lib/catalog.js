import { money } from './api.js';
export function organizerEvent(event) {
  const types = event.ticket_types || [];
  return { ...eventCard(event), rawStatus: event.status, status: ({ DRAFT: 'Draft', PUBLISHED: 'Published', IN_REVIEW: 'In review', REJECTED: 'Rejected', CANCELLED: 'Cancelled' })[event.status] || event.status, ticketCapacity: event.capacity, ticketsSold: types.reduce((sum, t) => sum + t.quantity_sold, 0), revenue: types.reduce((sum, t) => sum + t.quantity_sold * Number(t.price), 0), price: Number(types[0]?.price || 0), tags: [], eventType: 'Physical Event' };
}
export function eventCard(event) {
  const types = (event.ticket_types || []).filter(t => t.is_active);
  const price = types.length ? Math.min(...types.map(t => Number(t.price))) : null;
  return { ...event, ticket_types: types, dateDay: new Date(event.start_datetime).getDate(), dateMonth: new Date(event.start_datetime).toLocaleDateString("en-GB", { month: "short" }).toUpperCase(), time: new Date(event.start_datetime).toLocaleTimeString("en-NG", {hour:"2-digit",minute:"2-digit"}), text: event.title, text2: [event.city, event.state].filter(Boolean).join(', '), text3: price === null ? 'Unavailable' : price === 0 ? 'Free' : money(price), image: event.image || '/event.jpg', date: event.start_datetime?.slice(0, 10), location: event.venue, title: event.title };
}
export function hotelCard(hotel) {
  return { ...hotel, image: hotel.image || '/hotel.png', location: hotel.city, tag: hotel.is_active ? 'Available' : 'Unavailable', text: 'text-[#374151]', bg: 'bg-[#FFFFFFE5]', rating: hotel.rating || 0, reviews: hotel.review_count || 0, price: hotel.minimum_price == null ? null : Number(hotel.minimum_price) };
}
export function bookingCard(booking) {
  const types = { EVENT: 'event', HOTEL: 'hotel', FOOD: 'food', TRANSPORT: 'transport', TOURISM: 'tour' };
  return { ...booking, bookingId: booking.id, orderId: booking.booking_reference, title: booking.details?.title || booking.items.map(item => item.description).join(', '), eventName: booking.items[0]?.description || booking.kind, type: types[booking.kind], eventId: booking.details?.event_id, hotelId: booking.details?.hotel_id, event_date: booking.details?.start_datetime ? new Date(booking.details.start_datetime).toLocaleString() : "", location: booking.details?.location || "", price: money(booking.total_amount), payment: booking.status === "CONFIRMED" ? Number(booking.total_amount) === 0 ? "Free" : "Paid" : booking.status.toLowerCase().replaceAll("_", " "), quantity: `${booking.items.reduce((sum, item) => sum + item.quantity, 0)} item(s)`, status: booking.status === 'CONFIRMED' ? 'Confirmed' : booking.status === 'PENDING' ? 'Pending' : booking.status === 'CANCELLED' ? 'Cancelled' : booking.status, total: Number(booking.total_amount), totalAmount: Number(booking.total_amount), date: booking.created_at, image: '/event.jpg', attendee: { fullName: booking.customer_name, email: booking.details?.attendee_email || '' }, tickets: booking.items.map(item => ({ ...item, name: item.description, qty: item.quantity, price: Number(item.unit_price) })) };
}
export function restaurantCard(restaurant) {
  return { ...restaurant, image: restaurant.image || '/food1.jpg', gallery: [restaurant.image || '/restaurant-main.jpg'], aboutText: restaurant.description, customerReviews: [], rating: 0, reviews: 0, cuisine: '', time: '', distance: '', price: '', location: restaurant.city, minOrder: 0, priceRange: 'See menu', openHours: restaurant.accepts_orders ? 'Accepting orders' : 'Not accepting orders', popularDishes: [] };
}
export function tourCard(tour) {
  return { ...tour, image: tour.image || '/tour1.jpg', gallery: [tour.image || '/tour1.jpg'], location: tour.location_name, tag: tour.category, text2: tour.category, text: 'text-[#374151]', bg: 'bg-[#FFFFFFE5]', reviews: 0, aboutText: tour.description, facilities: [], ticketPrice: 'See available tours', openHours: 'Check with the provider', bestTimeToVisit: '', mapImage: '' };
}
