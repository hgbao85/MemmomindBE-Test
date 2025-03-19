import { Request, Response } from "express";
import { createPayment } from "../services/payment.service";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const createPaymentController = asyncHandler(
async (req: Request, res: Response) => {
  try {
    const { orderCode, amount, description, returnUrl, cancelUrl} = req.body;

    if (!orderCode || !amount || !returnUrl || !cancelUrl) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Thiếu thông tin bắt buộc" });
    }

    const paymentResponse = await createPayment({
      orderCode,
      amount,
      description,
      returnUrl,
      cancelUrl,
    });

    return res.status(HTTPSTATUS.OK).json(paymentResponse);
  } catch (error) {
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({ message: error });
  }
}
);
