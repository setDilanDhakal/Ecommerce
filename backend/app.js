import express from "express"
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import userRoutes from './routes/user.js'
import productRoutes from './routes/product.js'

dotenv.config({
  path: "./.env",
});

const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/users",userRoutes);
app.use("/products",productRoutes)

export default app;