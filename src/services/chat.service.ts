import vectorStore from "../config/vectorStore.js";
import Chat from "../models/Chat.model.js";
import Message from "../models/Message.model.js";
import { GoogleGenAI } from "@google/genai";
import { generateAndStoreEmbeddings } from "./embeddings.service.js";
import { ZodNullable } from "zod/v3";

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
  console.log("sendMesssage service called");
  const chat = await Chat.findOne({
    _id: data.chatId,
  });
  if (!chat) {
    console.log("chat not found");
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

  // do an vector search to get relevant chunks from the documents in the chat

  const collection = await vectorStore.getOrCreateCollection({
    name: "test",
    embeddingFunction: null,
  });

  const queryEmbeddings = await generateAndStoreEmbeddings({
    type: "query",
    chunk: data.content,
  });
  console.log("Query embeddings generated:", queryEmbeddings);
  const results = await collection.query({
    queryEmbeddings: [Array.from(queryEmbeddings)],
    include: ["documents", "metadatas", "distances"],
  });
  console.log("Vector search results:", results.documents[0]);

  const lastMessage = chatHistory[chatHistory.length - 1];
  if (lastMessage && lastMessage.parts && lastMessage.parts[0]) {
    lastMessage.parts[0].text = `Context from the data sources user has provided = \n\n${results.documents[0]}`;
  } else {
    // Handle the case where the message or parts is not available
    console.error("Error: Message or parts are undefined");
  }

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
