import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { HTTPSTATUS } from "../config/http.config";
import { getCurrentUserService } from "../services/user.service";
import { UnauthorizedException } from "../utils/appError";


export const getCurrentUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) {
      throw new UnauthorizedException("User not authenticated");
    }
    const { user } = await getCurrentUserService(userId);
    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "User fetch successfully",
      user,
    });
  }
);