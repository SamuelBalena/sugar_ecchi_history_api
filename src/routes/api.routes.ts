import { Router } from "express";
import * as admin from "../controllers/admin.controller.js";
import * as auth from "../controllers/auth.controller.js";
import * as catalog from "../controllers/catalog.controller.js";
import * as wishlist from "../controllers/wishlist.controller.js";
import { adminOnly } from "../middlewares/auth.middleware.js";
export const apiRouter = Router();
apiRouter.get("/", (_req, res) => res.json({ name: "Sugar Ecchi History API", version: "v1" }));
apiRouter.post("/auth/login", auth.login); apiRouter.get("/catalog", catalog.getCatalogController); apiRouter.get("/packs", catalog.listPacks); apiRouter.get("/packs/:slug", catalog.getPack);
for (const [path, list, get] of [["animes", catalog.listAnimes, catalog.getAnime], ["characters", catalog.listCharacters, catalog.getCharacter], ["collections", catalog.listCollections, catalog.getCollection], ["tags", catalog.listTags, catalog.getTag]] as const) { apiRouter.get(`/${path}`, list); apiRouter.get(`/${path}/:slug`, get); }
apiRouter.get("/wishlist", wishlist.listWishlist); apiRouter.post("/wishlist", wishlist.updateWishlist);
apiRouter.get("/admin/packs", adminOnly, admin.listPacks); apiRouter.post("/admin/packs", adminOnly, admin.createPack); apiRouter.patch("/admin/packs/:id", adminOnly, admin.updatePack); apiRouter.delete("/admin/packs/:id", adminOnly, admin.deletePack); apiRouter.post("/admin/characters", adminOnly, admin.createCharacter); apiRouter.post("/admin/tags", adminOnly, admin.createTag); apiRouter.post("/admin/collections", adminOnly, admin.createCollection);
