import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET ?? "development-only-secret-change-me";
export function adminOnly(req: Request, res: Response, next: NextFunction) {
  const token = req.header("authorization")?.replace(/^Bearer\s+/i, "");
  try {
    if (!token || (jwt.verify(token, secret) as { role?: string }).role !== "admin") throw new Error();
    next();
  } catch { res.status(401).json({ error: "Unauthorized" }); }
}
