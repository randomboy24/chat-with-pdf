import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["access_token"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log("user authenticated:", decoded);
    (req as any).access_token = decoded;
    (req as any).userId = (decoded as any).id;
    console.log("userId set in req:", (req as any).userId);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};
