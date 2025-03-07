export async function validateBirthDate(
  birthDate: Date | string,
): Promise<boolean> {
  if (typeof birthDate === 'string') {
    birthDate = new Date(birthDate);
  }
  const now = new Date();
  if (now.getFullYear() - birthDate.getFullYear() <= 18) {
    if (now.getFullYear() - birthDate.getFullYear() === 18) {
      if (birthDate.getMonth() === now.getMonth() + 1) {
        return now.getDate() >= birthDate.getDate();
      } else return now.getMonth() + 1 > birthDate.getMonth();
    }
    return false;
  }
  return true;
}
