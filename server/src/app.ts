import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
// import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/auth.middleware.js";
import clerkWebhookRoutes from "./routes/clerk.webhook.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
// app.use("/api/auth", authRoutes);
app.use("/api/chats", authMiddleware, chatRoutes);
app.use("/api/upload", authMiddleware, uploadRoutes);
app.get("/protected", authMiddleware, (req, res) => {
  res.status(200).send((req as any).access_token);
});
app.use("/webhooks", clerkWebhookRoutes);
export default app;
