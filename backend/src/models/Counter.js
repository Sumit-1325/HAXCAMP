import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

const ORDER_SEQUENCE = 'orderNumber';
const ORDER_NUMBER_START = 10000;

const formatOrderNumber = (sequence) => `NX-${ORDER_NUMBER_START + sequence}`;

export const nextOrderNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    ORDER_SEQUENCE,
    { $inc: { seq: 1 } },
    { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
  );

  return formatOrderNumber(counter.seq);
};

// Bulk seeding reserves a contiguous block in a single round trip instead of
// one atomic increment per order.
export const reserveOrderNumbers = async (count) => {
  const counter = await Counter.findByIdAndUpdate(
    ORDER_SEQUENCE,
    { $inc: { seq: count } },
    { returnDocument: 'after', upsert: true, setDefaultsOnInsert: true },
  );

  const last = counter.seq;
  const first = last - count + 1;

  return Array.from({ length: count }, (_, index) => formatOrderNumber(first + index));
};

export const resetOrderCounter = () =>
  Counter.findByIdAndUpdate(ORDER_SEQUENCE, { seq: 0 }, { upsert: true });
