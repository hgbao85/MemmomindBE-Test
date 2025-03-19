import express from "express";
import { handlePayOSWebhook } from "../controllers/webhook.controller";

const router = express.Router();

router.post("/payos", handlePayOSWebhook);

export default router;
