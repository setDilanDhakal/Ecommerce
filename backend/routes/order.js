import {Router} from 'express';
import {
  createOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} from "../controller/order.js";
import { verify, verifyAdmin } from "../middlewares/auth.js";

const orderRoute = Router();

orderRoute.route("/").post(verify, createOrder);
orderRoute.route("/").get(verify, verifyAdmin, getOrders);
orderRoute.route("/my").get(verify, getMyOrders);
orderRoute.route("/:id").get(verify, getOrder);
orderRoute.route("/:id/status").patch(verify, verifyAdmin, updateOrderStatus);
orderRoute.route("/:id").delete(verify, verifyAdmin, deleteOrder);

export default orderRoute
