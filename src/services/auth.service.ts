import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import { ProviderEnum } from "../enums/account-provider.enum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import { verifyToken } from "../services/token.service";
import { sendResetPasswordEmail } from "../services/email.service";
import { hashValue, compareValue } from "../utils/bcrypt";

export const createAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  const { providerId, provider, displayName, email, picture } = data;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log("Started Session...");

    let user = await UserModel.findOne({ email }).session(session);

    if (!user) {
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });

      const account = new AccountModel({
        userId: user._id,
        provider: provider,
        providerId: providerId,
      });
      await account.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    console.log("End Session...");

    return { user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};

export const registerUserService = async (body: {
  email: string;
  name: string;
  password: string;
}) => {
  const { email, name, password } = body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException("Tài khoản đã được đăng ký!");
    }

    const hashedPassword = await hashValue(password);
    console.log("Hashed Password:", hashedPassword); // Log để kiểm tra

    const user = new UserModel({
      email,
      name,
      password: hashedPassword,
      isVerified: false,
    });
    await user.save({ session });

    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save({ session });

    await session.commitTransaction();
    session.endSession();
    console.log("End Session...");

    return {
      userId: user._id,
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const verifyEmailService = async (token: string) => {
  const userId = verifyToken(token);

  if (!userId) {
    throw new BadRequestException("Token không hợp lệ");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại");
  }

  if (user.isVerified) {
    throw new BadRequestException("Email đã được xác thực trước đó");
  }

  user.isVerified = true;
  await user.save();

  return user;
};

export const forgotPasswordService = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    // Tránh tiết lộ thông tin về sự tồn tại của email
    return null;
  }

  await sendResetPasswordEmail(user._id as string, user.email);

  return user;
};

export const resetPasswordService = async (token: string, newPassword: string) => {
  const userId = verifyToken(token);

  if (!userId) {
    throw new BadRequestException("Token không hợp lệ");
  }

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new NotFoundException("Người dùng không tồn tại hoặc token không hợp lệ");
  }

  user.password = await hashValue(newPassword);
  await user.save();

  return user;
};

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}): Promise<Record<string, any> | null> => {
  const account = await AccountModel.findOne({ provider, providerId: email });
  if (!account) {
    throw new NotFoundException("Email không chính xác!");
  }

  const user = await UserModel.findById(account.userId);
  if (!user) {
    throw new NotFoundException("User not found for the given account");
  }

  const isMatch = await compareValue(password, user.password as string);
  console.log("Provided Password:", password);
  console.log("Hashed Password:", user.password);
  console.log("isMatch:", isMatch);

  if (!isMatch) {
    throw new UnauthorizedException("Mật khẩu không chính xác!");
  }

  return user.omitPassword();
};

export const changePasswordService = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundException("User not found");

  // Kiểm tra mật khẩu hiện tại
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new UnauthorizedException("Current password is incorrect");

  // Cập nhật mật khẩu mới
  user.password = await hashValue(newPassword);
  await user.save();
  return user;
};