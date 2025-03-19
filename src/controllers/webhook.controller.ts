import { Request, Response } from "express";
import crypto from "crypto";
import { HTTPSTATUS } from "../config/http.config";
import { config } from "../config/app.config";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

const PAYOS_CHECKSUM_KEY = config.PAYOS_CHECKSUM_KEY;

/**
 * Xác minh checksum của dữ liệu webhook từ PayOS
 */
const verifyChecksum = (data: Record<string, any>, checksum: string): boolean => {
  const sortedKeys = Object.keys(data).sort();
  const queryString = sortedKeys.map((key) => `${key}=${data[key]}`).join("&");
  const generatedChecksum = crypto.createHmac("sha256", PAYOS_CHECKSUM_KEY).update(queryString).digest("hex");
  return generatedChecksum === checksum;
};

/**
 * Xử lý webhook khi PayOS gửi thông báo giao dịch
 */
export const handlePayOSWebhook = asyncHandler(
async (req: Request, res: Response) => {
  try {
    const { orderCode, amount, status, checksum } = req.body;

    // Xác minh checksum để đảm bảo tính toàn vẹn dữ liệu
    if (!verifyChecksum({ orderCode, amount, status }, checksum)) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "Invalid checksum" });
    }

    // Kiểm tra trạng thái giao dịch
    if (status === "PAID") {
      console.log(`Giao dịch thành công - Order: ${orderCode}, Số tiền: ${amount}`);
    } else {
      console.log(`Giao dịch thất bại - Order: ${orderCode}, Trạng thái: ${status}`);
    }

    return res.status(HTTPSTATUS.OK).json({ message: "Webhook received" });
  } catch (error) {
    console.error("Lỗi xử lý webhook PayOS:", error);
    return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({ message: "Webhook xử lý thất bại" });
  }
}
);
