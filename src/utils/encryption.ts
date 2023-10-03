import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string) => {
  const bcryptPassword = await bcrypt.hash(password, 10);
  return bcryptPassword;
};

export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
