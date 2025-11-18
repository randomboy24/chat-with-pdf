import * as chatController from "../controllers/chat.controller.js";
import { Router } from "express";

const router = Router();

router.post("/", chatController.createChat);
router.get("/:userId", chatController.getChats);
router.delete("/:chatId", chatController.deleteChat);
router.post("/:chatId/messages", chatController.sendMessage);
router.get("/:chatId/messages", chatController.getMessages);

export default router;
