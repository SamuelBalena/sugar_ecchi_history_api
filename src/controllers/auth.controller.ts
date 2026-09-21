import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
const secret = process.env.JWT_SECRET ?? "development-only-secret-change-me";
const email = process.env.ADMIN_EMAIL ?? "admin@sugarecchi.local";
const password = process.env.ADMIN_PASSWORD ?? "change-me-before-production";
export function login(req: Request, res: Response) {
  const input = z.object({ email: z.string().email().optional(), password: z.string().min(1) }).safeParse(req.body);
  if (!input.success || (input.data.email && input.data.email !== email) || input.data.password !== password) return res.status(401).json({ error: "Invalid credentials" });
  return res.json({ token: jwt.sign({ role: "admin", email }, secret, { expiresIn: "8h" }), tokenType: "Bearer", expiresIn: 28800 });
}
