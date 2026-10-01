import assert from 'node:assert/strict';
import test from 'node:test';
import { eventCard, organizerEvent } from '../src/lib/catalog.js';

test('organizers can see and reactivate inactive tickets while the public sees only active tickets', () => {
  const event = {
    id: 'event-1', title: 'OFUITE ABIA', category: 'Food', status: 'PUBLISHED',
    start_datetime: '2026-10-10T10:00:00+01:00', city: 'Umuahia', capacity: 500,
    ticket_types: [{ id: 'ticket-1', name: 'Regular', price: '0.00', quantity_sold: 0, is_active: false }],
  };
  assert.equal(eventCard(event).ticket_types.length, 0);
  assert.equal(organizerEvent(event).ticket_types.length, 1);
  assert.equal(organizerEvent(event).ticket_types[0].is_active, false);
});
