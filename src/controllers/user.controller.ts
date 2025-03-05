import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService, getUserProfileService, updateUserProfileService  } from "../services/user.service";
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