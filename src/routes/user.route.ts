import { Router } from "express";
import { getCurrentUserController, getProfileController, updateProfileController  } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);
userRoutes.get("/profile", getProfileController);
userRoutes.put("/profile", updateProfileController);

export default userRoutes;