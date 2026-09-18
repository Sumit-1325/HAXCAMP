import mongoose from 'mongoose';

import { ORDER_STATUSES, PAYMENT_METHODS } from '../constants/index.js';

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true },
    image: { type: String, default: '' },
    qty: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, required: [true, 'Address line is required'], trim: true },
    line2: { type: String, trim: true, default: '' },
    city: { type: String, required: [true, 'City is required'], trim: true },
    state: { type: String, required: [true, 'State is required'], trim: true },
    postalCode: { type: String, required: [true, 'Postal code is required'], trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
  },
  { _id: false },
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Customer name is required'], trim: true },
    email: { type: String, required: [true, 'Customer email is required'], lowercase: true, trim: true },
    phone: { type: String, required: [true, 'Customer phone is required'], trim: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customer: { type: customerSchema, required: true },
    shippingAddress: { type: addressSchema, required: true },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => Array.isArray(items) && items.length > 0,
        message: 'An order must contain at least one item',
      },
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: {
        values: ORDER_STATUSES,
        message: `Status must be one of: ${ORDER_STATUSES.join(', ')}`,
      },
      default: 'Pending',
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: 'COD',
    },
  },
  { timestamps: true },
);

orderSchema.index({ createdAt: -1 });
orderSchema.index({ status: 1 });

export const Order = mongoose.model('Order', orderSchema);
