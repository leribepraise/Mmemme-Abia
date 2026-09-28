// Display estimate only. The backend rechecks the plan, stock and final price.
export function memberTicketPrice(ticket, plan = 'bronze') {
  const discount = ticket.membership_discount ? ({silver:15,diamond:30}[plan] || 0) : 0;
  return Math.round(Number(ticket.price) * (100 - discount)) / 100;
}
