import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { openapi } from "./docs/openapi.js";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";
import { apiRouter } from "./routes/api.routes.js";
export const app = express();
const configuredOrigins = process.env.FRONTEND_ORIGIN?.split(",").map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || !configuredOrigins || configuredOrigins.includes(origin) || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.get("/api-docs.json", (_req, res) => res.json(openapi));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.use("/api/v1", apiRouter); app.use(notFound); app.use(errorHandler);
