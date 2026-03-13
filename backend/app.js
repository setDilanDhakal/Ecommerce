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

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({extended:true, limit: "10mb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/users",userRoutes);
app.use("/products",productRoutes)
app.use("/carts",cartRoutes)
app.use("/orders",orderRoutes)

export default app;
