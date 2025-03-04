import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedException } from "../utils/appError";
import UserModel from "../models/user.model";

const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.warn("❌ Không có Authorization header! Request sẽ bị từ chối.");
        res.status(401).json({ message: "Unauthorized: No token provided" });
        return;
    }

    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key") as { userId: string };

        if (!decoded.userId) {
            throw new UnauthorizedException("Token is missing user ID");
        }

        const user = await UserModel.findById(decoded.userId).lean();

        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        if (!user.isVerified) {
          throw new UnauthorizedException("Email chưa được xác thực");
        }

        req.user = { ...user, _id: user._id.toString() } as Express.User;

        next();
    } catch (error) {
        console.error("❌ Token không hợp lệ:", error);
        res.status(401).json({ message: "Unauthorized: Invalid token" });
        return;
    }
};

export default isAuthenticated;