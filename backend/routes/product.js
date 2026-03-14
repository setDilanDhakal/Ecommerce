import {Router} from 'express';
import {
  createProduct,
  getProducts,
  getActiveProducts,
  getProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
} from "../controller/product.js";
import { verify, verifyAdmin } from "../middlewares/auth.js";
import { uploadProduct } from "../middlewares/multer.js";

const productRoute = Router();

productRoute.route("/").post(verify, verifyAdmin, uploadProduct.single("image"), createProduct);
productRoute.route("/").get(verify, verifyAdmin,getProducts);
productRoute.route("/active").get( getActiveProducts);
productRoute.route("/:id").get( getProduct);
productRoute.route("/:id").put(verify, verifyAdmin, uploadProduct.single("image"), updateProduct);
productRoute.route("/:id/status").patch(verify, verifyAdmin, updateProductStatus);
productRoute.route("/:id").delete(verify, verifyAdmin, deleteProduct);


export default productRoute
