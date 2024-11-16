import mongoose, { Document, Schema } from "mongoose";
import uniqueValidator from 'mongoose-unique-validator';

interface IUser extends Document {
  username: string;
  password: string;
  messages: mongoose.Types.ObjectId[];
  timestamp: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  messages: [{ type: mongoose.Types.ObjectId, ref: 'Message' }],
  timestamp: { type: Date, default: Date.now }
});

userSchema.plugin(uniqueValidator);
export const User = mongoose.model<IUser>('User', userSchema);
