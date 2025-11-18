import type { Request, Response } from "express";
import { userSchema } from "../validators/user.validator.js";
import * as authService from "../services/auth.service.js";
import { ZodError } from "zod";

export const signUp = async (req: Request, res: Response) => {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error });
  }

  try {
    const token = await authService.signUp(parsed.data);
    res.status(201).json({ token });
  } catch (error: any) {
    if (
      error.message.includes("User already exists") ||
      error.name === "ZodError" ||
      error.code === 11000
    )
      return res.status(400).json({ message: error.message.format });

    return res.status(500).json({ message: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response) => {
  const parsed = userSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.format() });
  }
  try {
    const token = await authService.login(parsed.data);
    res.status(200).json({ token });
  } catch (error: any) {
    if (error.message?.includes("User doesn't exists")) {
      return res.status(400).json({ message: error.message });
    }

    if (error instanceof ZodError) {
      return res.status(400).json({ errors: error.format() });
    }

    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate key error" });
    }

    return res.status(500).json({ message: error.message });
  }
};
