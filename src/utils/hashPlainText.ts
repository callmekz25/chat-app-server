import bcrypt from 'bcrypt';
export const hashPlainText = async (text: string): Promise<string> => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashed = await bcrypt.hash(text, salt);
  return hashed;
};
