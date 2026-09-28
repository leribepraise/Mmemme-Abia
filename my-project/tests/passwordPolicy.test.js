import test from 'node:test';
import assert from 'node:assert/strict';
import { passwordError } from '../src/lib/passwordPolicy.js';
import { signupSchema } from '../src/components/auth/register/validation/schemas/signupSchema.js';

test('password policy accepts the agreed combinations without identity comparisons', () => {
  for (const value of ['Wayne123!', 'Password1!', 'ABCDEFG1!', 'Abcdef1_', 'Abcdef1£', 'Abcdef1😀']) {
    assert.equal(passwordError(value), '', value);
  }
});

test('password policy rejects missing requirements, spaces as symbols, and invalid lengths', () => {
  for (const value of ['Abc1!', 'abcdef1!', 'Abcdefg!', 'Abcdefg1', 'Abcdef1 ', 'Abcdef1\n', 'A1!' + 'x'.repeat(126)]) {
    assert.notEqual(passwordError(value), '', value);
  }
});

test('signup validates email and matching passwords while allowing similar personal details', () => {
  const fields = { fullName: 'Wayne123', email: 'wayne123@gmail.com', password: 'Wayne123!', confirmPassword: 'Wayne123!', terms: true };
  assert.equal(signupSchema.safeParse(fields).success, true);
  for (const changes of [{ email: 'bad@gmail' }, { password: 'wayne123!', confirmPassword: 'wayne123!' }, { confirmPassword: 'Different1!' }]) {
    assert.equal(signupSchema.safeParse({ ...fields, ...changes }).success, false);
  }
});
