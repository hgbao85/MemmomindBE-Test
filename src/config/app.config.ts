import { getEnv } from "../utils/get-env";

const appConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "3000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  MONGO_URI: getEnv("MONGO_URI"),
  SESSION_SECRET: getEnv("SESSION_SECRET"),
  SESSION_EXPIRES_IN: getEnv("SESSION_EXPIRES_IN"),
  GOOGLE_CLIENT_ID: getEnv("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnv("GOOGLE_CLIENT_SECRET"),
  GOOGLE_CALLBACK_URL: getEnv("GOOGLE_CALLBACK_URL"),
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:5173, https://memmomind.io.vn, https://memmomind.vercel.app"),
  FRONTEND_GOOGLE_CALLBACK_URL: getEnv("FRONTEND_GOOGLE_CALLBACK_URL"),
  EMAIL_USER: getEnv("EMAIL_USER"),
  EMAIL_PASS: getEnv("EMAIL_PASS"),
  JWT_SECRET: getEnv("JWT_SECRET"),
});

export const config = appConfig();