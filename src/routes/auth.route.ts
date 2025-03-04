import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import {
  googleLoginCallback,
  loginController,
  logOutController,
  registerUserController,
  forgotPasswordController,
  resetPasswordController,
  verifyEmailController,
} from "../controllers/auth.controller";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout", logOutController);

authRoutes.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRoutes.get("/google/callback", passport.authenticate("google", { failureRedirect: failedUrl }), googleLoginCallback);

authRoutes.post("/forgot-password", forgotPasswordController);
authRoutes.post("/reset-password", resetPasswordController);

authRoutes.get("/verify-email", verifyEmailController);

export default authRoutes;