import { test } from 'node:test';
import assert from 'node:assert/strict';
import { organizerStats } from '../src/lib/organizerStats.js';

test('reports use confirmed booking snapshots, not current ticket prices or pending orders', () => {
  const now = new Date('2026-09-23T12:00:00Z');
  const event = { id: 'event', ticket_types: [{ id: 'type', price: '9999.00' }] };
  const booking = { kind: 'EVENT', status: 'CONFIRMED', details: { event_id: 'event' }, items: [{ quantity: 2, ticket_type: 'type' }], total_amount: '4000.00', created_at: now.toISOString() };
  const stats = organizerStats([event], [booking, { ...booking, status: 'PENDING' }, { ...booking, kind: 'HOTEL' }, { ...booking, status: 'REFUNDED' }], now);
  assert.equal(stats.sold, 2);
  assert.equal(stats.revenue, 4000);
  assert.equal(stats.events[0].revenue, 4000);
  assert.equal(stats.refunded, 4000);
  assert.equal(stats.days.at(-1).tickets, 2);
  assert.equal(stats.days.length, 30);
  assert.ok(!stats.points('tickets').includes('NaN'));
});

test('empty reports return zero totals and valid chart coordinates', () => {
  const stats = organizerStats([], []);
  assert.equal(stats.average, 0);
  assert.equal(stats.sold, 0);
  assert.ok(!stats.points('revenue').includes('NaN'));
});
