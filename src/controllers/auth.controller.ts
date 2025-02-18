import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService } from "../services/auth.service";
import passport from "passport";
import jwt from "jsonwebtoken";

export const googleLoginCallback = asyncHandler(
    async (req: Request, res: Response) => {
      return res.redirect(`${config.FRONTEND_ORIGIN}/homepage`);
    }
  );

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Tài khoản được tạo thành công!",
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined
      ) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || "Sai email hoặc mật khẩu",
          });
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          // ✅ Tạo JWT token
          const token = jwt.sign(
            { userId: user._id }, // Payload phải chứa _id
            process.env.JWT_SECRET || "your_secret_key",
            { expiresIn: "7d" } // Thời hạn token
          );

          return res.status(HTTPSTATUS.OK).json({
            success: true,
            message: "Đăng nhập thành công!",
            user,
            token,  // ✅ Trả token về cho frontend
          });
        });
      }
    )(req, res, next);
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res
          .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
          .json({ error: "Đăng xuất thất bại!" });
      }
    });

    req.session = null;
    return res
      .status(HTTPSTATUS.OK)
      .json({ message: "Đăng xuất thành công!" });
  }
);
