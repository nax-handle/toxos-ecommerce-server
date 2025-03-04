import * as bcrypt from 'bcrypt';

export const hashPassword = (
  password: string,
  saltOrRounds: number,
): Promise<string> => {
  return bcrypt.hash(password, saltOrRounds);
};
export function comparePassword(
  plainText: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(plainText, hash);
}
