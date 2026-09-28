export const PASSWORD_HELP = 'Use 8-128 characters, including an uppercase letter (A-Z), a number (0-9), and a special character such as !, @ or #.';

export function passwordError(value) {
  const length = [...value].length;
  if (length < 8) return 'Password must be at least 8 characters.';
  if (length > 128) return 'Password must be no more than 128 characters.';
  if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter (A-Z).';
  if (!/[0-9]/.test(value)) return 'Password must contain at least one number (0-9).';
  if (!/[\p{P}\p{S}]/u.test(value)) return 'Password must contain at least one special character, such as !, @ or #.';
  return '';
}
