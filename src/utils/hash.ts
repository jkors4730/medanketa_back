import bcrypt from 'bcrypt';

export const passwordHash = (plainPassword: string): string => {
  return bcrypt.hashSync(plainPassword, 10);
};

export const comparePassword = (
  plainPassword: string,
  passwordHash: string,
): boolean => {
  return bcrypt.compareSync(plainPassword, passwordHash);
};
