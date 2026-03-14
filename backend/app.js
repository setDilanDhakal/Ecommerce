import express from "express"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import userRoutes from './routes/users.js'
import productRoutes from './routes/product.js'
import cartRoutes from './routes/cart.js'
import orderRoutes from './routes/order.js'

dotenv.config({
  path: "./.env",
});

const app=express();

const normalizeOrigin = (value) => {
  if (!value) return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  return `http://${trimmed}`;
};

const allowedOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map(normalizeOrigin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, false);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({extended:true, limit: "10mb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/users",userRoutes);
app.use("/products",productRoutes)
app.use("/carts",cartRoutes)
app.use("/orders",orderRoutes)

export default app;
