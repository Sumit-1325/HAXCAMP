import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.model('Counter', counterSchema);

const ORDER_SEQUENCE = 'orderNumber';

export const nextOrderNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    ORDER_SEQUENCE,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return `NX-${10000 + counter.seq}`;
};

export const resetOrderCounter = () => Counter.findByIdAndUpdate(
  ORDER_SEQUENCE,
  { seq: 0 },
  { upsert: true },
);
