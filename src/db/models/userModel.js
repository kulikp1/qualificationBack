import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    // Auth
    name: { type: String, required: false, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // User
    gender: {
      type: String,
      required: true,
      enum: ['woman', 'man'],
      default: 'woman',
    },
    photo: {
      type: String,
      required: false,
      default:
        'https://res.cloudinary.com/dcftarozu/image/upload/v1726306975/x4vbd01sgp1vlylokwhv.png',
    },

    weight: {
      type: Number,
      default: 0,
    },
    activeTime: {
      type: Number,
      default: 0,
    },
    dailyNorm: {
      type: Number,
      required: true,
      default: 1.7,
    },
  },
  { timestamps: true, versionKey: false },
);

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const UserCollection = model('user', userSchema);