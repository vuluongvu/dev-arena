import * as bcrypt from 'bcrypt';

// constant: salt level rounds
const SALT_ROUNDS = 10;

// function: hash password
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, SALT_ROUNDS);
}

// function: compare password
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}
