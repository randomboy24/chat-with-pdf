import type { Request, Response } from "express";
import { chatSchema } from "../validators/chat.validator.js";
import * as chatService from "../services/chat.service.js";

export const createChat = async (req: Request, res: Response) => {
  // Implementation for creating a chat
  try {
    console.log("createChat called");
    console.log("Received data to createChat:", req.body);

    const parsed = chatSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log("Validation failed for createChat:", parsed.error);
      return res.status(400).json({ errors: parsed.error });
    }

    // Call to chat service to create chat
    const chat = await chatService.createChat(parsed.data);
    console.log("Chat created successfully:", chat);
    res.status(201).json(chat);
  } catch (error) {
    console.error("Error in createChat:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getChats = async (req: Request, res: Response) => {
  // Implementation for retrieving chats
  console.log("getChats called");
  try {
    const { userId } = req.params;
    if (!userId) {
      console.log("getChats: missing userId");
      return res.status(400).json({ error: "bad request" });
    }

    console.log("Fetching chats for userId:", userId);
    const chats = await chatService.getChats({
      userId: userId,
    });
    console.log("Fetched chats:", chats);
    return res.status(200).json(chats);
  } catch (error) {
    console.error("Error in getChats:", error);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteChat = async (req: Request, res: Response) => {
  // Implementation for deleting a chat
  console.log("deleteChat called");
  try {
    const { chatId } = req.params;
    if (!chatId) {
      console.log("deleteChat: missing chatId");
      return res.status(400).json({ error: "bad request" });
    }

    console.log("Deleting chatId:", chatId);
    const deleted = await chatService.deleteChat({
      chatId: chatId,
    });
    console.log("Chat deleted:", deleted);
    return res.status(200).json(deleted);
  } catch (error) {
    console.error("Error in deleteChat:", error);
    return res.status(500).json({ message: (error as Error).message });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  // Implementation for creating a message in a chat
  console.log("sendMessage called");
  try {
    const { chatId } = req.params;
    const { content } = req.body;
    console.log("sendMessage inputs:", { chatId, content });

    if (!chatId || !content) {
      console.log("sendMessage: missing chatId or content");
      return res.status(400).json({ error: "bad request" });
    }

    try {
      const message = await chatService.sendMessage({
        chatId: chatId,
        content: content,
      });
      console.log("Message sent:", message);
      return res.status(201).json(message);
    } catch (error) {
      console.error("Error in sendMessage (service):", error);
      return res.status(500).json({ message: (error as Error).message });
    }
  } catch (error) {
    console.error("Error in sendMessage:", error);
    return res.status(400).json({ message: (error as Error).message });
  }
};

export const getMessages = async (req: Request, res: Response) => {
  // Implementation for retrieving messages from a chat
  console.log("getMessages called");
  try {
    const { chatId } = req.params;
    if (!chatId) {
      console.log("getMessages: missing chatId");
      return res.status(400).json({ error: "bad request" });
    }

    console.log("Fetching messages for chatId:", chatId);
    const messages = await chatService.getMessages({
      chatId: chatId,
    });
    console.log("Fetched messages:", messages);
    return res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    return res.status(500).json({ message: (error as Error).message });
  }
};
