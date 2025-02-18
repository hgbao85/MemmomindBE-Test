import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import {
  verifyUserService,
} from "../services/auth.service";
import UserModel from "../models/user.model";


passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: true,
    },
    async (email, password, done) => {
      try {
        const user = await verifyUserService({ email, password });

        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        return done(null, user as Express.User); // 🛠 Ép kiểu về Express.User
      } catch (error: any) {
        return done(error, false, { message: error?.message });
      }
    }
  )
);


passport.serializeUser((user: any, done) => {
    done(null, user._id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await UserModel.findById(id);
      done(null, user as Express.User); // 🛠 Ép kiểu về Express.User
    } catch (error) {
      done(error, null);
    }
  });
  