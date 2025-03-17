import UserModel from "../models/user.model";
import { BadRequestException, NotFoundException } from "../utils/appError";
import { UserRole } from "../models/user.model";

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

export const updateTotalCostService = async (
  userId: string,
  newCost: number
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (user.role === UserRole.COST_VERSION) {
    // Kiểm tra xem totalCost có vượt quá totalPurchasedCost không
    if (user.totalCost + newCost > user.totalPurchasedCost) {
      throw new BadRequestException("Total cost exceeds total purchased cost");
    }

    // Cộng dồn giá trị totalCost mới
    user.totalCost += newCost;
  } else if (user.role === UserRole.FREE_VERSION) {
    // Kiểm tra xem freeCost có vượt quá totalFreeCost không
    if (user.freeCost + newCost > user.totalFreeCost) {
      throw new BadRequestException("Free cost exceeds total free cost");
    }

    // Cộng dồn giá trị freeCost mới
    user.freeCost += newCost;
  }

  // Lưu thay đổi vào cơ sở dữ liệu
  await user.save();

  return user;
};

export const updateTotalPurchasedCostService = async (
  userId: string,
  purchasedCost: number
) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  // Cộng dồn giá trị totalPurchasedCost mới
  user.totalPurchasedCost += purchasedCost;

  // Lưu thay đổi vào cơ sở dữ liệu
  await user.save();

  return user;
};

// export const updateFreeCostService = async (
//   userId: string,
//   freeCost: number
// ) => {
//   const user = await UserModel.findById(userId);
//   if (!user) {
//     throw new NotFoundException("User not found");
//   }

//   if (user.role !== UserRole.FREE_VERSION) {
//     throw new BadRequestException("User is not in free version");
//   }

//   // Kiểm tra xem freeCost có vượt quá totalFreeCost không
//   if (user.freeCost + freeCost > user.totalFreeCost) {
//     throw new BadRequestException("Free cost exceeds total free cost");
//   }

//   // Cộng dồn giá trị freeCost mới
//   user.freeCost += freeCost;

//   // Lưu thay đổi vào cơ sở dữ liệu
//   await user.save();

//   return user;
// };