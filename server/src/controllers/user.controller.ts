import type { Request, Response } from "express";
import * as userService from "../services/user.service.js";
import * as schema from "../validators/user.validator.js";

export const createUser = async (req: Request, res: Response) => {
  try {
    console.log("createUser called");
    console.log("Received data to createUser:", req.body);
    const parsed = schema.userSchema.safeParse(req.body);
    if (!parsed.success) {
      console.log("Validation failed for createUser:", parsed.error);
      return res.status(400).json({ errors: parsed.error });
    }
    const user = await userService.createUser(req.body);
    console.log("User created successfully:", user);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error in createUser:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  console.log("getUsers called");
  try {
    const users = await userService.getUsers();
    console.log("Fetched users:", users);
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: (error as Error).message });
  }
};
