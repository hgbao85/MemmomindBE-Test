import mongoose, { Document, Schema } from "mongoose";
import { compareValue, hashValue } from "../utils/bcrypt";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  profilePicture: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
  comparePassword(value: string): Promise<boolean>;
  omitPassword(): Omit<UserDocument, "password">;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, select: true },
    profilePicture: {
      type: String,
      default: null,
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password"))
  next();
});

userSchema.methods.omitPassword = function () {
  const { password, ...userWithoutPassword } = this.toObject();
  return userWithoutPassword;
};

userSchema.methods.comparePassword = async function (value: string) {
  try {
    const isMatch = await compareValue(value, this.password);
    console.log("comparePassword - Provided Password:", value);
    console.log("comparePassword - Hashed Password:", this.password);
    console.log("comparePassword - isMatch:", isMatch);
    return isMatch;
  } catch (error) {
    console.error("comparePassword - Error comparing passwords:", error);
    throw new Error("Error comparing passwords");
  }
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;