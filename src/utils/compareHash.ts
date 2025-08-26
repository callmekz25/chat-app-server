import bcrypt from 'bcrypt';
export const compareHash = async (plainText, hashed) => {
  try {
    return await bcrypt.compare(plainText, hashed);
  } catch (error) {
    console.log(error);
  }
};
