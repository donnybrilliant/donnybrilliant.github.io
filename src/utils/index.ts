/**
 * Calculate age from obfuscated birth date
 * Uses mathematical expressions to avoid hardcoding the actual date
 */
export function calculateAge(): number {
  // Obfuscated date calculation using nested operations
  const month = Math.floor(Math.sqrt(Math.pow(3, 4)));
  const day = Math.pow(2, 4);
  const year = 2000 - Math.floor(Math.sqrt(144));

  const today = new Date();
  const birthDate = new Date(year, month - 1, day); // month is 0-indexed in Date constructor

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  // If birthday hasn't occurred this year yet, subtract 1
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}
