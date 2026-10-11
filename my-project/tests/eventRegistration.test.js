import assert from 'node:assert/strict';
import test from 'node:test';
import { registrationDestination } from '../src/lib/eventRegistration.js';
import { eventCard } from '../src/lib/catalog.js';
import { buildSearchIndex } from '../src/data/searchIndex.js';

const now = Date.parse('2026-10-10T09:00:00Z');
const event = {
  id: 'external-event', title: 'Tech registration', category: 'Business',
  status: 'PUBLISHED', registration_type: 'EXTERNAL', registration_url: 'https://www.abiatechrise.ng/register',
  start_datetime: '2026-10-12T09:00:00Z', end_datetime: '2026-10-12T19:00:00Z',
  ticket_types: [{ id: 'old-ticket', is_active: true, price: '5000.00' }],
};

test('external events show registration rather than ticket stock or a misleading free price', () => {
  const card = eventCard(event);
  assert.deepEqual(card.ticket_types, []);
  assert.equal(card.text3, 'External registration');
  assert.equal(buildSearchIndex({ eventss: [card] })[0].priceLabel, 'External registration');
  assert.deepEqual(registrationDestination(card, now), { href: event.registration_url, host: 'www.abiatechrise.ng' });
});

test('external registration rejects unsafe links and unavailable events', () => {
  for (const registration_url of ['javascript:alert(1)', '//example.com', 'http://example.com', 'https://user:secret@example.com', 'https://example.com\\@other.com', '', 'https://example.com/ bad']) {
    assert.equal(registrationDestination({ ...event, registration_url }, now), null, registration_url);
  }
  for (const updates of [{ registration_type: 'TICKETED' }, { status: 'DRAFT' }, { is_suspended: true }, { end_datetime: '2026-10-01T19:00:00Z' }, { end_datetime: null }]) {
    assert.equal(registrationDestination({ ...event, ...updates }, now), null);
  }
});

test('existing ticketed event prices stay available', () => {
  const ticketed = eventCard({ ...event, registration_type: 'TICKETED', registration_url: '' });
  assert.equal(ticketed.ticket_types.length, 1);
  assert.notEqual(ticketed.text3, 'External registration');
});
