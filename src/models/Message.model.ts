import { Schema, model } from "mongoose";

const MessageSchema = new Schema(
  {
    chatId: { type: String, required: true },
    sender: {
      type: String,
      enum: ["user", "model"],
      required: true,
    },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const Message = model("Message", MessageSchema);

export default Message;
