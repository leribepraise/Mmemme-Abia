import assert from 'node:assert/strict';
import test from 'node:test';
import { eventStepError, nextEndDate } from '../src/lib/eventFormValidation.js';

const complete = {
  title: 'Community concert', description: 'An evening of live music',
  venue: 'City Hall', city: 'Aba', date: '2026-11-12', startTime: '17:00',
  endDate: '2026-11-12', endTime: '22:00', price: '5000', capacity: '100',
};

test('event dates keep a valid end date when the start changes', () => {
  assert.equal(nextEndDate('2026-11-13', '2026-11-12'), '2026-11-13');
  assert.equal(nextEndDate('2026-11-12', '2026-11-14'), '2026-11-14');
});

test('event stage two identifies missing fields and invalid times', () => {
  assert.deepEqual(eventStepError({ ...complete, city: '' }, 2), {
    field: 'event-city', message: 'Enter the city.',
  });
  assert.deepEqual(eventStepError({ ...complete, endTime: '16:00' }, 2), {
    field: 'event-end-date', message: 'The end date and time must be after the start.',
  });
  assert.equal(eventStepError(complete, 2), null);
});

test('event stage three rejects invalid ticket quantities and prices', () => {
  assert.equal(eventStepError({ ...complete, price: '-1' }, 3).field, 'event-price');
  assert.equal(eventStepError({ ...complete, capacity: '0' }, 3).field, 'event-capacity');
  assert.equal(eventStepError(complete, 3), null);
});
