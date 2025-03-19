import mongoose, { Document, Schema, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  orderCode: string;
  amount: number;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    },
    orderCode: {
      type: String,
      unique: true,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const TransactionModel = mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default TransactionModel;
