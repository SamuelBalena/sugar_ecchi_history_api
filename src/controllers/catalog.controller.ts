import type { Request, Response } from "express";
import { getCatalog } from "../models/catalog.model.js";
function bySlug<T extends { slug: string }>(items: T[], slug: string, res: Response) { const item = items.find((x) => x.slug === slug); return item ? res.json(item) : res.status(404).json({ error: "Not found" }); }
export const getCatalogController = async (_req: Request, res: Response) => res.json(await getCatalog());
export async function listPacks(req: Request, res: Response) { let packs = (await getCatalog()).packs.filter((p) => p.isPublished); const query = String(req.query.query ?? "").toLowerCase(); if (req.query.featured === "true") packs = packs.filter((p) => p.isFeatured); if (req.query.bestseller === "true") packs = packs.filter((p) => p.isBestseller); if (query) packs = packs.filter((p) => [p.slug, p.title.en, p.title.ja, p.description.en, p.description.ja].join(" ").toLowerCase().includes(query)); res.json(packs); }
export async function getPack(req: Request, res: Response) { bySlug((await getCatalog()).packs.filter((p) => p.isPublished), String(req.params.slug), res); }
export const listAnimes = async (_req: Request, res: Response) => res.json((await getCatalog()).animes);
export const getAnime = async (req: Request, res: Response) => bySlug((await getCatalog()).animes, String(req.params.slug), res);
export const listCharacters = async (_req: Request, res: Response) => res.json((await getCatalog()).characters);
export const getCharacter = async (req: Request, res: Response) => bySlug((await getCatalog()).characters, String(req.params.slug), res);
export const listCollections = async (_req: Request, res: Response) => res.json((await getCatalog()).collections);
export const getCollection = async (req: Request, res: Response) => bySlug((await getCatalog()).collections, String(req.params.slug), res);
export const listTags = async (_req: Request, res: Response) => res.json((await getCatalog()).tags);
export const getTag = async (req: Request, res: Response) => bySlug((await getCatalog()).tags, String(req.params.slug), res);
