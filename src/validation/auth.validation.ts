import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Invalid email address")
  .min(1)
  .max(255);

export const passwordSchema = z.string().trim().min(4);

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: emailSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1),
  newPassword: passwordSchema,
});

export const verifyEmailSchema = z.object({
  token: z.string().trim().min(1),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(255).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});