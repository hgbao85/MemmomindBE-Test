import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "cookie-session";
import connectDatabase from "./config/database.config";
import { config } from "./config/app.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";
import noteRoutes from "./routes/note.route";
import { HTTPSTATUS } from "./config/http.config";
import "./schedulers/freeCostScheduler";
import paymentRoutes from "./routes/payment.route";
import webhookRoutes from "./routes/webhook.router";


const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    name: "session",
    keys: [config.SESSION_SECRET],
    maxAge: 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  })
);

app.use(passport.initialize());
app.use(passport.session());


// app.use(
//   cors({
//     origin: true,
//     credentials: true,
//   })
// );


app.use(
  cors({
    origin: ["http://localhost:5173", "https://memmomind.io.vn", "https://memmomind.vercel.app", "https://memmomind-fe-test.vercel.app"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


app.get("/", (req: Request, res: Response) => {
  res.status(HTTPSTATUS.OK).json({
    message: "Welcome to MemmoMind API",
  });
});

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/note`, isAuthenticated, noteRoutes);
app.use(`${BASE_PATH}/payment`, isAuthenticated, paymentRoutes);
app.use(`${BASE_PATH}/webhook`, webhookRoutes);

app.use(errorHandler);

app.listen(Number(config.PORT), async () => {
  console.log(`Server listening on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});