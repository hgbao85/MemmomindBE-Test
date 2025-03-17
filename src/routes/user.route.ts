import { Router } from "express";
import { getCurrentUserController, getProfileController, updateProfileController, updateTotalCostController, updateTotalPurchasedCostController } from "../controllers/user.controller";
import isAuthenticated from "../middlewares/isAuthenticated.middleware";

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);
userRoutes.get("/profile", getProfileController);
userRoutes.put("/profile", updateProfileController);
userRoutes.post("/update-cost", updateTotalCostController, isAuthenticated);
userRoutes.post("/update-total-purchased-cost", isAuthenticated, updateTotalPurchasedCostController);

export default userRoutes;