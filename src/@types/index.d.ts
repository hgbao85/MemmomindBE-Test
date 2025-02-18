import { UserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface User extends Omit<UserDocument, "password"> {
      _id: string; // Đảm bảo _id là string
    }

    interface Request {
      user?: User;
    }
  }
}
