import { model, Schema } from 'mongoose';

const userSchema = new Schema(
  {
    // Auth
    name: { type: String, required: false, default: null },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // User
    
    photo: {
      type: String,
      required: false,
      
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