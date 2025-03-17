import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registerSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema, changePasswordSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import { registerUserService, verifyEmailService, forgotPasswordService, resetPasswordService, changePasswordService } from "../services/auth.service";
import passport from "passport";
import jwt from "jsonwebtoken";
import { sendVerificationEmail, sendResetPasswordEmail } from "../services/email.service";
import { BadRequestException, NotFoundException, UnauthorizedException } from "../utils/appError";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    return res.redirect(`${config.FRONTEND_ORIGIN}/homepage`);
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);

    const { userId } = await registerUserService(body);

    // Gửi email xác thực
    await sendVerificationEmail(userId as string, body.email);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Tài khoản được tạo thành công! Vui lòng kiểm tra email để xác thực tài khoản. Nếu không thấy email, vui lòng kiểm tra hòm thư rác.",
    });
  }
);

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = verifyEmailSchema.parse(req.query);

    if (!token) {
      throw new BadRequestException("Token không hợp lệ");
    }

    const user = await verifyEmailService(token);

    if (!user) {
      throw new NotFoundException("Người dùng không tồn tại");
    }

    return res.status(HTTPSTATUS.OK).json({
      success: true,
      message: "Email đã được xác thực thành công!",
      user: user.omitPassword(),
    });
  }
);
  
  export const forgotPasswordController = asyncHandler(
    async (req: Request, res: Response) => {
      const { email } = forgotPasswordSchema.parse(req.body);
  
      await forgotPasswordService(email);
  
      return res.status(HTTPSTATUS.OK).json({
        message: "Email đặt lại mật khẩu đã được gửi! Vui lòng kiểm tra email của bạn. Nếu không thấy email, vui lòng kiểm tra hòm thư rác.",
      });
    }
  );

  export const resetPasswordController = asyncHandler(
    async (req: Request, res: Response) => {
      const { token, newPassword } = resetPasswordSchema.parse(req.body);
  
      const user = await resetPasswordService(token, newPassword);
  
      if (!user) {
        throw new BadRequestException("Người dùng không tồn tại hoặc token không hợp lệ");
      }
  
      return res.status(HTTPSTATUS.OK).json({
        success: true,
        message: "Mật khẩu đã được đặt lại thành công!",
        user: user.omitPassword(),
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
            console.error("Error during authentication:", err);
            return next(err);
          }
  
          if (!user) {
            console.warn("Authentication failed:", info?.message || "Invalid credentials");
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({
              message: info?.message || "Sai email hoặc mật khẩu",
            });
          }
  
          req.logIn(user, (err) => {
            if (err) {
              console.error("Error logging in user:", err);
              return next(err);
            }
  
            // Tạo JWT token
            const token = jwt.sign(
              { userId: user._id }, // Payload phải chứa _id
              process.env.JWT_SECRET || "your_secret_key",
              { expiresIn: "1d" } // Thời hạn token
            );
  
            return res.status(HTTPSTATUS.OK).json({
              success: true,
              message: "Đăng nhập thành công!",
              user,
              token,  // Trả token về cho frontend
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

  export const changePasswordController = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?._id;
    if (!userId) throw new UnauthorizedException("User not authenticated");
    const { currentPassword, newPassword } = changePasswordSchema.parse(req.body);
    const updatedUser = await changePasswordService(userId, currentPassword, newPassword);
    return res.status(HTTPSTATUS.OK).json({
      message: "Password changed successfully",
      user: updatedUser.omitPassword(),
    });
  });
