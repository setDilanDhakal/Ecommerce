// index.js
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/users.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import orderRoutes from "./routes/order.js";

dotenv.config({ path: "./.env" });

const app = express();

// --------------------
// CORS CONFIGURATION
// --------------------
const normalizeOrigin = (value) => {
  if (!value) return "";
  let trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.endsWith("/")) trimmed = trimmed.slice(0, -1); // remove trailing slash
  return trimmed;
};

const normalizeHost = (value) => {
  const normalized = normalizeOrigin(value);
  if (!normalized) return "";
  if (normalized.startsWith("*.")) return normalized;
  try {
    if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
      return new URL(normalized).host;
    }
  } catch {
    return "";
  }
  return normalized.replace(/^https?:\/\//, "").split("/")[0];
};

const allowedOriginList = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => normalizeOrigin(s))
  .filter(Boolean);

const allowedOrigins = new Set(
  allowedOriginList
    .filter((o) => o.startsWith("http://") || o.startsWith("https://"))
    .map((o) => normalizeOrigin(o))
);
const allowedHosts = new Set(
  allowedOriginList
    .filter((o) => !(o.startsWith("http://") || o.startsWith("https://")) && !o.startsWith("*."))
    .map((o) => normalizeHost(o))
    .filter(Boolean)
);
const allowedWildcards = allowedOriginList
  .filter((o) => o.startsWith("*."))
  .map((o) => o.slice(2))
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow server-to-server requests
      const normalizedOrigin = normalizeOrigin(origin);
      if (allowedOrigins.size === 0 && allowedHosts.size === 0 && allowedWildcards.length === 0) {
        return callback(null, true);
      }

      if (allowedOrigins.has(normalizedOrigin)) return callback(null, true);
      try {
        const parsed = new URL(normalizedOrigin);
        if (allowedHosts.has(parsed.host)) return callback(null, true);
        if (allowedWildcards.some((suffix) => parsed.hostname === suffix || parsed.hostname.endsWith(`.${suffix}`))) {
          return callback(null, true);
        }
      } catch {
        if (allowedHosts.has(normalizedOrigin)) return callback(null, true);
      }
      return callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// --------------------
// BODY PARSING & STATIC
// --------------------
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// --------------------
// ROUTES
// --------------------
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);

export default app;
