import Chat from "../models/Chat.model.js";
import Message from "../models/Message.model.js";
import { GoogleGenAI } from "@google/genai";

export const createChat = async (data: {
  userId: string;
  documentIds?: string[] | undefined;
}) => {
  // Implementation for creating a chat

  const chat = new Chat({
    documentIds: data.documentIds,
    userId: data.userId,
  });

  return await chat.save();
};

export const getChats = async (data: { userId: string }) => {
  // Implementation for retrieving chats
  return await Chat.find({
    userId: data.userId,
  });
};

export const deleteChat = async (data: { chatId: string }) => {
  // Implementation for deleting a chat
  const deleted = await Chat.deleteOne({
    _id: data.chatId,
  });
  if (!deleted) {
    throw new Error("Chat not found");
  }
  return deleted;
};

export const sendMessage = async (data: {
  content: string;
  chatId: string;
}) => {
  // Implementation for creating a message in a chat
  const chat = await Chat.findOne({
    _id: data.chatId,
  });
  if (!chat) {
    throw new Error("Chat not found");
  }

  const userMessage = await Message.create({
    chatId: data.chatId,
    content: data.content,
    sender: "user",
  });
  const messages = await getMessages({
    chatId: data.chatId,
  });

  const chatHistory = messages.map((message) => {
    return {
      role: message.sender === "user" ? "user" : "model",
      parts: [
        {
          text: message.content,
        },
      ],
    };
  });

  // do an llm call

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_KEY!,
  });

  const aiResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: chatHistory,
  });

  const aiMessage = await Message.create({
    chatId: data.chatId,
    content: aiResponse.text,
    sender: "model",
  });
  return {
    aiMessage,
    userMessage,
  };
};

export const getMessages = async (data: { chatId: string }) => {
  // Implementation for retrieving messages from a chat
  const messages = await Message.find({
    chatId: data.chatId,
  })
    .sort({ createdAt: 1 })
    .lean();

  return messages;
};
