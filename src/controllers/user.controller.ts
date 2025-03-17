import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService, getUserProfileService, updateUserProfileService, updateTotalCostService, updateTotalPurchasedCostService } from "../services/user.service";
import { profileUpdateSchema } from "../validation/auth.validation";
import { UnauthorizedException } from "../utils/appError";

export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({
        message: "User not authenticated",
      });
    }
    const { user } = await getCurrentUserService(userId);
    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "User fetched successfully",
      user,
    });
  }
);

export const getProfileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new UnauthorizedException("User not authenticated");
  const user = await getUserProfileService(userId);
  return res.status(HTTPSTATUS.OK).json({ user });
});

export const updateProfileController = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) throw new UnauthorizedException("User not authenticated");
  const body = profileUpdateSchema.parse(req.body);
  const updatedUser = await updateUserProfileService(userId, body);
  return res.status(HTTPSTATUS.OK).json({ user: updatedUser });
});

// Thêm controller cho updateTotalCost
export const updateTotalCostController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId, newCost } = req.body;

      // Kiểm tra đầu vào
      if (!userId || typeof newCost !== "number") {
        return res.status(400).json({ message: "Invalid input" });
      }

      // Cập nhật totalCost
      const updatedUser = await updateTotalCostService(userId, newCost);

      // Trả về thông tin người dùng đã cập nhật
      return res.status(200).json({
        success: true,
        message: "Total cost updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error in updateTotalCostController:", error);
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }
);

export const updateTotalPurchasedCostController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { userId, purchasedCost } = req.body;

      // Kiểm tra đầu vào
      if (!userId || typeof purchasedCost !== "number") {
        return res.status(400).json({ message: "Invalid input" });
      }

      // Cập nhật totalPurchasedCost
      const updatedUser = await updateTotalPurchasedCostService(userId, purchasedCost);

      // Trả về thông tin người dùng đã cập nhật
      return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Total purchased cost updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Error in updateTotalPurchasedCostController:", error);
      return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
        error: (error as Error).message,
      });
    }
  }
);

// export const updateFreeCostController = asyncHandler(
//   async (req: Request, res: Response) => {
//     try {
//       const { userId, freeCost } = req.body;

//       // Kiểm tra đầu vào
//       if (!userId || typeof freeCost !== "number") {
//         return res.status(400).json({ message: "Invalid input" });
//       }

//       // Cập nhật freeCost
//       const updatedUser = await updateFreeCostService(userId, freeCost);

//       // Trả về thông tin người dùng đã cập nhật
//       return res.status(HTTPSTATUS.OK).json({
//         success: true,
//         message: "Free cost updated successfully",
//         user: updatedUser,
//       });
//     } catch (error) {
//       console.error("Error in updateFreeCostController:", error);
//       return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Internal Server Error",
//         error: (error as Error).message,
//       });
//     }
//   }
// );