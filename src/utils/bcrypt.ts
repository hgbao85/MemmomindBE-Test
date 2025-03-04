import bcrypt from "bcrypt";

export const hashValue = async (value: string, saltRounds: number = 10) => {
  try {
    const hashedValue = await bcrypt.hash(value, saltRounds);
    console.log("hashValue - Provided Password:", value);
    console.log("hashValue - Hashed Password:", hashedValue);
    return hashedValue;
  } catch (error) {
    console.error("hashValue - Error hashing password:", error);
    throw new Error("Error hashing password");
  }
};

export const compareValue = async (value: string, hashedValue: string) => {
  try {
    const isMatch = await bcrypt.compare(value, hashedValue);
    console.log("compareValue - Provided Password:", value);
    console.log("compareValue - Hashed Password:", hashedValue);
    console.log("compareValue - isMatch:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("compareValue - Error comparing passwords:", error);
    throw new Error("Error comparing passwords");
  }
};