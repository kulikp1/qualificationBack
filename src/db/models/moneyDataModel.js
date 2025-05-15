import { model, Schema } from 'mongoose';

const moneyItemSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    value: { type: Number, required: true },
    category: { type: String, required: true }, // Додано поле категорії

  },
  { timestamps: true, versionKey: false },
);

export const MoneyDataCollection = model('moneyitem', moneyItemSchema);