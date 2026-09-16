export const seedEvents = [
  { id: 'evt-01', title: 'Three Steps Live Concert', category: 'Music', venue: 'Umuahia Sports Arena, Umuahia', date: '2026-05-24', status: 'Published', ticketsSold: 842, ticketCapacity: 1000, revenue: 420000, image: '/Event Thumbnail.png', tags: ['Concert', 'Live Music'], description: 'A night of live music, good energy and unforgettable performances in Umuahia.', eventType: 'Physical Event' },
  { id: 'evt-02', title: 'Abia Business Summit 2026', category: 'Business', venue: 'The Dome, Umuahia', date: '2026-06-13', status: 'Published', ticketsSold: 1000, ticketCapacity: 1000, revenue: 4360000, image: '/Event Thumbnail-1.png', tags: ['Business', 'Networking'], description: 'A focused gathering for founders, builders and the people shaping Abia business.', eventType: 'Physical Event' },
  { id: 'evt-03', title: 'Abia Food & Drink Festival', category: 'Food', venue: 'Amakama Event Park, Amachara', date: '2026-07-05', status: 'Draft', ticketsSold: 0, ticketCapacity: 700, revenue: 0, image: '/Event Thumbnail-2.png', tags: ['Food', 'Culture'], description: 'A generous table of local flavour, new makers and familiar favourites.', eventType: 'Physical Event' },
  { id: 'evt-04', title: 'Women in Tech Conference', category: 'Technology', venue: 'BCA Event Hall, Aba', date: '2026-08-29', status: 'Draft', ticketsSold: 0, ticketCapacity: 450, revenue: 0, image: '/Event Thumbnail-3.png', tags: ['Technology', 'Community'], description: 'Ideas, tools and honest conversations for women building the future.', eventType: 'Hybrid Event' },
  { id: 'evt-05', title: 'Gospel Night Live', category: 'Faith', venue: 'Grace Events Centre, Umuahia', date: '2026-09-12', status: 'Completed', ticketsSold: 180, ticketCapacity: 400, revenue: 360000, image: '/event5.jpg', tags: ['Faith', 'Music'], description: 'An evening of music, worship and shared gratitude.', eventType: 'Physical Event' },
];

export const seedMessages = [
  { id: 'msg-01', sender: 'Mmemme Support', subject: 'Your event is now live', preview: 'Three Steps Live Concert is visible to the public.', time: 'Today, 10:42', unread: true, body: 'Three Steps Live Concert has passed review and is now visible to the public. Your event page, ticket link and organizer profile are ready to share.' },
  { id: 'msg-02', sender: 'Ifeoma Nwosu', subject: 'Vendor space enquiry', preview: 'Hello, I would like to reserve a vendor space...', time: 'Yesterday', unread: true, body: 'Hello, I would like to reserve a vendor space for the Abia Food & Drink Festival. Could you share the available sizes and the payment timeline?' },
  { id: 'msg-03', sender: 'Mmemme Finance', subject: 'Payout processed', preview: 'Your payout of \u20a6420,000 has been processed.', time: 'May 18', unread: false, body: 'Your payout of \u20a6420,000 for Three Steps Live Concert has been processed and is on its way to your nominated account.' },
  { id: 'msg-04', sender: 'Chinedu Okoro', subject: 'Ticket transfer question', preview: 'Can I transfer my ticket to a friend?', time: 'May 16', unread: false, body: 'Can I transfer my ticket to a friend? The ticket was purchased under my name but I will no longer be in Umuahia on the event date.' },
];

export const seedPayouts = [
  { id: 'pay-01', date: 'May 18, 2026', amount: 420000, status: 'Paid', reference: 'MM-7C2F-318A' },
  { id: 'pay-02', date: 'Apr 04, 2026', amount: 185000, status: 'Paid', reference: 'MM-41D0-2BA8' },
  { id: 'pay-03', date: 'Jun 21, 2026', amount: 120000, status: 'Pending', reference: 'MM-92AC-17E1' },
];

export const seedOrganizer = { name: 'Shalom Events', email: 'shalom@events.ng', phone: '+234 813 456 6709', organization: 'Shalom Events Entertainment', bio: 'We create unforgettable live experiences that bring people together through music, culture and meaningful moments.', location: 'Umuahia, Abia State', avatar: 'SE' };

export const seedTicketTypes = {
  'evt-01': [
    { id: 'tt-01', name: 'VIP', description: 'Front row access, meet & greet', price: 20000, sold: 80, limit: 200, status: 'Active' },
    { id: 'tt-02', name: 'Regular', description: 'General admission', price: 10000, sold: 180, limit: 400, status: 'Active' },
    { id: 'tt-03', name: 'VVIP', description: 'Backstage access, VIP lounge', price: 50000, sold: 30, limit: 50, status: 'Active' },
    { id: 'tt-04', name: 'Early Bird', description: 'Limited time offer', price: 5000, sold: 100, limit: 100, status: 'Sold Out' },
  ],
  'evt-02': [
    { id: 'tt-05', name: 'Delegate Pass', description: 'Full-day summit access with lunch', price: 15000, sold: 640, limit: 800, status: 'Active' },
    { id: 'tt-06', name: 'VIP Table', description: 'Front-row table for 4, includes networking dinner', price: 120000, sold: 40, limit: 50, status: 'Active' },
    { id: 'tt-07', name: 'Student Pass', description: 'Valid student ID required at entry', price: 5000, sold: 150, limit: 150, status: 'Sold Out' },
  ],
};

export const seedDiscounts = {
  'evt-01': [
    { id: 'dc-01', name: 'Group of 5+', type: 'Percentage', value: 10, appliesTo: 'Regular', status: 'Active' },
    { id: 'dc-02', name: 'Student Discount', type: 'Fixed', value: 2000, appliesTo: 'VIP', status: 'Inactive' },
  ],
  'evt-02': [
    { id: 'dc-03', name: 'Corporate Table (3+)', type: 'Percentage', value: 15, appliesTo: 'VIP Table', status: 'Active' },
  ],
};

export const seedPromoCodes = {
  'evt-01': [
    { id: 'pc-01', code: 'SBLC10', discount: '10% off', uses: 34, limit: 100, expiry: '2026-10-20', status: 'Active' },
    { id: 'pc-02', code: 'EARLYBIRD', discount: '\u20a62,000 off', uses: 100, limit: 100, expiry: '2026-09-01', status: 'Expired' },
  ],
  'evt-02': [
    { id: 'pc-03', code: 'SUMMIT26', discount: '5% off', uses: 12, limit: 200, expiry: '2026-06-10', status: 'Active' },
  ],
};

export const seedTicketSettings = {
  allowTransfers: true,
  enableWaitlist: true,
  requireAttendeeInfo: false,
  hideRemainingCount: false,
  salesCloseHours: 2,
};
