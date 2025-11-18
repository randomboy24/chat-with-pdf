import z from "zod";

export const chatSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  documentIds: z.array(z.string()).optional(),
});
