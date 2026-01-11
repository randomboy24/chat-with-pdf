import { Router } from "express";
import { clerkWebhook } from "../controllers/clerk.webhook.controller.js";

const router = Router();

router.post('/clerk', clerkWebhook)

export default router;  