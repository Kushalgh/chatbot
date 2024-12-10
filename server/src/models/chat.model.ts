import mongoose, { Document, Schema } from "mongoose";

interface IMessage {
  text: string;
  isUser: boolean;
}

export interface IChat extends Document {
  sessionId: string;
  messages: IMessage[];
  context: {
    currentNodeId: string;
    tempData: Record<string, any>;
  };
}

const messageSchema = new Schema<IMessage>({
  text: { type: String, required: true },
  isUser: { type: Boolean, required: true },
});

const chatSchema = new Schema<IChat>({
  sessionId: { type: String, required: true, unique: true },
  messages: [messageSchema],
  context: {
    currentNodeId: { type: String, required: true },
    tempData: { type: Schema.Types.Mixed, default: {} },
  },
});

const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;
