import { Schema } from 'mongoose';
import address from './types/address-type';

const OrderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    summaryTitle: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    address,
    request: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: 'μν μ€λΉ',
    },
  },
  {
    collection: 'orders',
    timestamps: true,
  },
);

export { OrderSchema };
