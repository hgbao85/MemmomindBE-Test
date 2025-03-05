import UserModel from "../models/user.model";
import { BadRequestException, NotFoundException } from "../utils/appError";


export const getCurrentUserService = async (userId: string) => {
  const user = await UserModel.findById(userId)
    .select("-password");

  if (!user) {
    throw new BadRequestException("User not found");
  }

  return {
    user,
  };
};

export const getUserProfileService = async (userId: string) => {
  const user = await UserModel.findById(userId).select("-password");
  if (!user) throw new NotFoundException("User not found");
  return user;
};

export const updateUserProfileService = async (
  userId: string,
  updates: { name?: string; bio?: string }
) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundException("User not found");
  Object.assign(user, updates);
  await user.save();
  return user;
};