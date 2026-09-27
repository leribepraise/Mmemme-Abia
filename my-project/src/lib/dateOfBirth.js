import { z } from 'zod';

export function todayInLagos(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = type => parts.find(part => part.type === type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

export function dateOfBirthError(value, today = todayInLagos()) {
  if (!value) return 'Date of birth is required';
  if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value) || Number(value.slice(0, 4)) < 1) return 'Enter a valid date of birth';
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return 'Enter a valid date of birth';
  if (value > today) return 'Date of birth cannot be in the future';
  return null;
}

export const dateOfBirthSchema = z.string().superRefine((value, context) => {
  const message = dateOfBirthError(value);
  if (message) context.addIssue({ code: 'custom', message });
});
