import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.middleware";
import { createPaymentController } from "../controllers/payment.controller";

const router = express.Router();

router.post("/create-payment", isAuthenticated, createPaymentController);

export default router;
