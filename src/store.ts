import mongoose, { Schema, model } from "mongoose";
import type { Catalog } from "./types.js";

const localizedText = new Schema({ en: { type: String, required: true }, ja: { type: String, required: true } }, { _id: false });
const animeSchema = new Schema({ id: { type: String, required: true }, slug: { type: String, required: true }, name: { type: localizedText, required: true }, description: { type: localizedText, required: true } }, { _id: false });
const characterSchema = new Schema({ id: { type: String, required: true }, slug: { type: String, required: true }, animeId: { type: String, required: true }, name: { type: localizedText, required: true }, description: { type: localizedText, required: true } }, { _id: false });
const collectionSchema = new Schema({ id: { type: String, required: true }, slug: { type: String, required: true }, title: { type: localizedText, required: true }, description: { type: localizedText, required: true } }, { _id: false });
const tagSchema = new Schema({ id: { type: String, required: true }, slug: { type: String, required: true }, label: { type: localizedText, required: true } }, { _id: false });
const packSchema = new Schema({
  id: { type: String, required: true }, slug: { type: String, required: true }, title: { type: localizedText, required: true }, description: { type: localizedText, required: true }, contents: { type: localizedText, required: true },
  galleryUrls: { type: [String], default: [] }, characterIds: { type: [String], default: [] }, tagIds: { type: [String], default: [] }, collectionIds: { type: [String], default: [] },
  price: { type: Number, required: true }, compareAtPrice: Number, isPublished: { type: Boolean, required: true }, isFeatured: { type: Boolean, required: true }, isBestseller: { type: Boolean, required: true },
  fileCount: { type: Number, required: true }, format: { type: String, required: true }, salesCount: { type: Number, required: true }, patreonUrl: { type: String, required: true }, createdAt: { type: String, required: true }
}, { _id: false });
const catalogSchema = new Schema<Catalog>({ animes: [animeSchema], characters: [characterSchema], collections: [collectionSchema], tags: [tagSchema], packs: [packSchema] }, { versionKey: false });
const CatalogModel = model<Catalog>("Catalog", catalogSchema);
const wishlistSchema = new Schema({ visitorId: { type: String, required: true, unique: true }, packIds: { type: [String], default: [] } }, { versionKey: false });
const WishlistModel = model("Wishlist", wishlistSchema);

const seed: Catalog = {
  animes: [{ id: "an-crimson", slug: "crimson-academy", name: { en: "Crimson Academy", ja: "紅学園" }, description: { en: "Elite night academy series.", ja: "夜の名門学園シリーズ。" } }],
  characters: [{ id: "ch-reina", slug: "reina", animeId: "an-crimson", name: { en: "Reina", ja: "レイナ" }, description: { en: "Head of the night council.", ja: "夜の評議会の長。" } }],
  collections: [{ id: "co-gothic", slug: "gothic-luxe", title: { en: "Gothic Luxe", ja: "ゴシックリュクス" }, description: { en: "Wine velvet and candlelight.", ja: "ワインのベルベットと燭光。" } }],
  tags: [{ id: "tg-gown", slug: "gown", label: { en: "Gown", ja: "ドレス" } }],
  packs: [{ id: "pk-01", slug: "reina-crimson-gown", title: { en: "Reina — Crimson Gown", ja: "レイナ — 紅のガウン" }, description: { en: "Full-length gown set of Reina.", ja: "レイナのロングドレスセット。" }, contents: { en: "42 illustrations, 4K PNG + WEBP.", ja: "イラスト42点、4K PNG + WEBP。" }, galleryUrls: [], characterIds: ["ch-reina"], tagIds: ["tg-gown"], collectionIds: ["co-gothic"], price: 18, compareAtPrice: 24, isPublished: true, isFeatured: true, isBestseller: true, fileCount: 42, format: "PNG / WEBP", salesCount: 1284, patreonUrl: "https://www.patreon.com/c/SugarEcchi", createdAt: "2026-08-02" }]
};

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  await mongoose.connect(uri);
  await CatalogModel.updateOne({}, { $setOnInsert: seed }, { upsert: true });
}
export async function getCatalog(): Promise<Catalog> {
  const catalog = await CatalogModel.findOne().lean<Catalog>();
  if (!catalog) throw new Error("Catalog was not initialized");
  return catalog;
}
export async function saveCatalog(next: Catalog): Promise<Catalog> {
  await CatalogModel.updateOne({}, { $set: next });
  return next;
}
export async function getWishlist(visitorId: string): Promise<string[]> {
  const wishlist = await WishlistModel.findOne({ visitorId }).lean<{ packIds: string[] }>();
  return wishlist?.packIds ?? [];
}
export async function toggleWishlist(visitorId: string, packId: string): Promise<string[]> {
  const current = await getWishlist(visitorId);
  const packIds = current.includes(packId) ? current.filter((id) => id !== packId) : [...current, packId];
  await WishlistModel.updateOne({ visitorId }, { $set: { packIds } }, { upsert: true });
  return packIds;
}
export const createId = (prefix: string) => `${prefix}-${crypto.randomUUID().slice(0, 8)}`;
