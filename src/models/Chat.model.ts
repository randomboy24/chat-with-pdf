import { model, Schema } from "mongoose";

export interface IChat {
  documentIds: string[];
  userId: string;
}

const chatSchema = new Schema<IChat>(
  {
    userId: { type: String, required: true },
    documentIds: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Chat = model("Chat", chatSchema);

export default Chat;
