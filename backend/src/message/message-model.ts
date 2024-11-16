import mongoose, { Document, Schema } from "mongoose";

interface IMessage extends Document {
  message: string;
  creator: mongoose.Schema.Types.ObjectId;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  message: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

export const Message = mongoose.model<IMessage>('Message', messageSchema);
