import {Router} from 'express';
import {
  addToCart,
  clearCart,
  getMyCart,
  removeCartItem,
  updateCartItem,
} from "../controller/cart.js";
import { verify } from "../middlewares/auth.js";

const cartRoute = Router();

cartRoute.route("/my").get(verify, getMyCart);
cartRoute.route("/items").post(verify, addToCart);
cartRoute.route("/items/:productId").patch(verify, updateCartItem);
cartRoute.route("/items/:productId").delete(verify, removeCartItem);
cartRoute.route("/my").delete(verify, clearCart);

export default cartRoute
