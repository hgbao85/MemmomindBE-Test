import axios from "axios";
import crypto from "crypto";
import { config } from "../config/app.config";

const PAYOS_BASE_URL = config.PAYOS_BASE_URL;
const PAYOS_CLIENT_ID = config.PAYOS_CLIENT_ID;
const PAYOS_API_KEY = config.PAYOS_API_KEY;
const PAYOS_CHECKSUM_KEY = config.PAYOS_CHECKSUM_KEY;

export interface CreatePaymentParams {
  orderCode: string;
  amount: number;
  description?: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface CreatePaymentResponse {
  checkoutUrl: string;
}

/**
 * Hàm tạo checksum để bảo vệ dữ liệu gửi đến PayOS
 */
const generateChecksum = (data: Record<string, any>): string => {
  const sortedKeys = Object.keys(data).sort();
  const queryString = sortedKeys.map((key) => `${key}=${data[key]}`).join("&");
  return crypto.createHmac("sha256", PAYOS_CHECKSUM_KEY).update(queryString).digest("hex");
};

/**
 * Hàm tạo đơn hàng thanh toán trên PayOS
 */
export const createPayment = async (params: CreatePaymentParams): Promise<CreatePaymentResponse> => {
  try {
    const signature = generateChecksum(params);
    const payload = {
      clientId: PAYOS_CLIENT_ID,
      orderCode: params.orderCode,
      amount: params.amount,
      description: params.description || "Thanh toán đơn hàng",
      returnUrl: params.returnUrl,
      cancelUrl: params.cancelUrl,
      signature,
    };

    // const checksum = generateChecksum(payload);

    const response = await axios.post(`${PAYOS_BASE_URL}/v2/payment-requests`, payload, {
      headers: {
        "Content-Type": "application/json",
        "x-client-id": PAYOS_CLIENT_ID,
        "x-api-key": PAYOS_API_KEY,
        // "x-checksum": checksum,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating PayOS payment:", error);
    throw new Error("Không thể tạo đơn hàng thanh toán");
  }
};
