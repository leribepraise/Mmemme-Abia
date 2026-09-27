import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dateOfBirthError, todayInLagos } from '../src/lib/dateOfBirth.js';

test('birth dates reject future, malformed and impossible calendar dates', () => {
  for (const value of ['', '2026-09-28', '2030-01-01', '2001-02-29', '2000-02-30', '0000-01-01', '27/09/2000', '2000-13-01']) {
    assert.ok(dateOfBirthError(value, '2026-09-27'), value);
  }
});
test('birth dates accept leap days and today without imposing a minimum age', () => {
  for (const value of ['2000-02-29', '2026-09-27', '1900-01-01']) assert.equal(dateOfBirthError(value, '2026-09-27'), null);
});
test('date boundary matches the backend Lagos timezone', () => {
  assert.equal(todayInLagos(new Date('2026-09-27T23:30:00Z')), '2026-09-28');
  assert.equal(todayInLagos(new Date('2026-09-27T22:30:00Z')), '2026-09-27');
});
