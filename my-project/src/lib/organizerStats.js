export function organizerStats(events, bookings, now = new Date()) {
  const eventBookings = bookings.filter(booking => booking.kind === 'EVENT');
  const confirmed = eventBookings.filter(booking => booking.status === 'CONFIRMED');
  const quantity = booking => booking.items.reduce((sum, item) => sum + item.quantity, 0);
  const sold = confirmed.reduce((sum, booking) => sum + quantity(booking), 0);
  const revenue = confirmed.reduce((sum, booking) => sum + Number(booking.total_amount), 0);
  const eventRows = events.map(event => {
    const rows = confirmed.filter(booking => booking.details.event_id === event.id || booking.items.some(item => event.ticket_types.some(type => type.id === item.ticket_type)));
    return { ...event, ticketsSold: rows.reduce((sum, booking) => sum + quantity(booking), 0), revenue: rows.reduce((sum, booking) => sum + Number(booking.total_amount), 0) };
  });
  const days = Array.from({ length: 30 }, (_, index) => {
    const day = new Date(now); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - 29 + index);
    const next = new Date(day); next.setDate(next.getDate() + 1);
    const rows = confirmed.filter(booking => new Date(booking.created_at) >= day && new Date(booking.created_at) < next);
    return { label: day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }), tickets: rows.reduce((sum, booking) => sum + quantity(booking), 0), revenue: rows.reduce((sum, booking) => sum + Number(booking.total_amount), 0) };
  });
  const points = (field, width = 1000, height = 200) => {
    const max = Math.max(1, ...days.map(day => day[field]));
    return days.map((day, index) => `${index ? 'L' : 'M'}${index * width / 29},${height - day[field] / max * (height - 10)}`).join(' ');
  };
  return { confirmed, sold, revenue, events: eventRows, days, points, average: confirmed.length ? revenue / confirmed.length : 0, refunded: eventBookings.filter(row => row.status === 'REFUNDED').reduce((sum, row) => sum + Number(row.total_amount), 0) };
}
