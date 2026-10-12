import assert from 'node:assert/strict';
import test from 'node:test';
import { authPagePath, authReturnFrom, clearAuthReturn, postAuthPath, readAuthReturn, rememberAuthReturn, safeAuthReturn, sharedEventPath } from '../src/lib/authNavigation.js';

const memoryStorage = () => {
  const values = new Map();
  return { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};
const event = '/events/cd1f0ab3-d15d-447b-9b52-75d0814fe688';

test('sharing prefers the readable event name and preserves older links', () => {
  assert.equal(sharedEventPath({ id: 'uuid', slug: 'legacy-abc123', share_slug: 'abia-tech-rise' }), '/share/events/abia-tech-rise');
  assert.equal(sharedEventPath({ slug: 'abia-tech-rise-2' }), '/share/events/abia-tech-rise-2');
  assert.equal(sharedEventPath({ share_slug: '../signup' }), '/events');
  assert.equal(sharedEventPath(null), '/events');
});

test('a shared event goes through signup and login with its exact destination', () => {
  assert.equal(sharedEventPath('cd1f0ab3-d15d-447b-9b52-75d0814fe688'), '/share/events/cd1f0ab3-d15d-447b-9b52-75d0814fe688');
  const signup = new URL(authPagePath('/signup', event), 'https://mmemme.com.ng');
  const afterRefresh = authReturnFrom({ search: signup.search }, memoryStorage());
  assert.equal(afterRefresh, event);
  const login = new URL(authPagePath('/login', afterRefresh), 'https://mmemme.com.ng');
  assert.equal(authReturnFrom({ search: login.search }, memoryStorage()), event);
  assert.equal(postAuthPath({ onboarding_completed_at: null }, afterRefresh), event);
  assert.equal(postAuthPath({ onboarding_completed_at: '2026-10-01' }, afterRefresh), event);
});

test('event return survives an OAuth round trip and is cleared after use', () => {
  const storage = memoryStorage();
  rememberAuthReturn(event, storage, Date.now());
  assert.equal(authReturnFrom({ search: '?flow=user&verify=1' }, storage), event);
  assert.equal(authReturnFrom({ state: { from: '/organizer/apply' } }, storage), '/organizer/apply');
  assert.equal(authReturnFrom({ search: `?next=${encodeURIComponent(event)}` }, storage), event);
  clearAuthReturn(storage);
  assert.equal(readAuthReturn(storage), '');
});

test('unsafe URLs and auth loops cannot become post-login destinations', () => {
  for (const value of [undefined, '', 'https://attacker.example', '//attacker.example', '/\\attacker.example', '/%2f%2fattacker.example', '/%255cattacker.example', '/events/\nelsewhere', '/%00events', '/login', '/signup?next=/events/1', '/auth/social/complete', '/events/../api/auth/', '/share/events/id', '/%ZZ']) {
    assert.equal(safeAuthReturn(value), '', String(value));
  }
  assert.equal(safeAuthReturn(`${event}?ticket=standard#tickets`), `${event}?ticket=standard#tickets`);
  assert.equal(authPagePath('/signup', 'https://attacker.example'), '/signup');
  assert.equal(sharedEventPath('../../login'), '/events');
});

test('expired or inaccessible storage cannot break signup navigation', () => {
  const storage = memoryStorage();
  rememberAuthReturn(event, storage, 100);
  assert.equal(readAuthReturn(storage, 100 + 24 * 60 * 60 * 1000 + 1), '');
  const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); }, removeItem() { throw new Error('blocked'); } };
  assert.equal(rememberAuthReturn(event, blocked), event);
  assert.equal(authReturnFrom({ search: `?next=${encodeURIComponent(event)}` }, blocked), event);
  assert.equal(readAuthReturn(blocked), '');
  assert.doesNotThrow(() => clearAuthReturn(blocked));
});

test('normal signup and organizer sign-in retain their usual destinations', () => {
  assert.equal(postAuthPath({ onboarding_completed_at: null }, ''), '/Signup/onboarding');
  assert.equal(postAuthPath({ onboarding_completed_at: '2026-10-01' }, ''), '/dashboard');
  assert.equal(postAuthPath({ role: 'ORGANIZER', is_verified: true }, '', true), '/organizer/dashboard');
  assert.equal(postAuthPath({ role: 'USER' }, '', true), '/organizer/apply');
});
