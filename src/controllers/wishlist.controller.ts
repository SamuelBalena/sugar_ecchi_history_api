import type { Request, Response } from "express";
import { z } from "zod";
import { getCatalog } from "../models/catalog.model.js";
import { getWishlist, toggleWishlist } from "../models/wishlist.model.js";
export async function listWishlist(req: Request, res: Response) { const visitor = req.header("x-visitor-id"); if (!visitor) return res.status(400).json({ error: "X-Visitor-Id is required" }); return res.json(await getWishlist(visitor)); }
export async function updateWishlist(req: Request, res: Response) { const data = z.object({ packId: z.string() }).safeParse(req.body); const visitor = req.header("x-visitor-id"); if (!visitor || !data.success) return res.status(400).json({ error: "X-Visitor-Id and packId are required" }); if (!(await getCatalog()).packs.some((p) => p.id === data.data.packId)) return res.status(404).json({ error: "Pack not found" }); return res.json(await toggleWishlist(visitor, data.data.packId)); }
