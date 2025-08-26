import bcrypt from 'bcrypt';
export const hashPlainText = async (text: string) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(text, salt);
    return hashed;
  } catch (error) {
    console.log(error);
  }
};
