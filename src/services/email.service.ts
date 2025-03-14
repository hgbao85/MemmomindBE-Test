import nodemailer from "nodemailer";
import { BadRequestException } from "../utils/appError";
import { createVerificationToken } from "../services/token.service";
import { config } from "../config/app.config";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  export const sendVerificationEmail = async (userId: string, email: string) => {
    const verificationToken = createVerificationToken(userId);
  
    const mailOptions = {
      from: '"MemmoMind" <noreply@memmomind.io.vn>',
      to: email,
      subject: "Xác thực Tài Khoản MemmoMind",
      text: `Chào bạn,\n\nVui lòng nhấp vào liên kết sau để xác thực tài khoản của bạn:\n\n${config.FRONTEND_ORIGIN}/api/auth/verify-email?token=${verificationToken}`,
      html: `<p>Chào bạn,</p><p>Vui lòng nhấp vào liên kết sau để xác thực tài khoản của bạn:</p><p><a href="${config.FRONTEND_ORIGIN}/api/auth/verify-email?token=${verificationToken}">Xác thực tài khoản</a></p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending verification email:", error);
      throw new BadRequestException("Không thể gửi email xác thực");
    }
  };

  export const sendResetPasswordEmail = async (userId: string, email: string) => {
    const verificationToken = createVerificationToken(userId);
  
    const mailOptions = {
      from: '"MemmoMind" <noreply@memmomind.io.vn>',
      to: email,
      subject: "Đặt Lại Mật Khẩu MemmoMind",
      text: `Chào bạn,\n\nVui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn:\n\n${config.FRONTEND_ORIGIN}/reset-password?token=${verificationToken}`,
      html: `<p>Chào bạn,</p><p>Vui lòng nhấp vào liên kết sau để đặt lại mật khẩu của bạn:</p><p><a href="${config.FRONTEND_ORIGIN}/reset-password?token=${verificationToken}">Đặt lại mật khẩu</a></p>`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Error sending reset password email:", error);
      throw new BadRequestException("Không thể gửi email đặt lại mật khẩu");
    }
  };