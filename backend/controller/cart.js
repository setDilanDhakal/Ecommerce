import mongoose from "mongoose";
import Cart from "../model/cart.js";
import Product from "../model/product.js";

// [SECTION] Recalculate Cart
const recalcCart = async (cart) => {
  const ids = cart.cartItems.map((i) => i.productId).filter(Boolean);
  const products = await Product.find({ _id: { $in: ids }, isActive: true }).select(
    "_id price"
  );
  const priceMap = new Map(products.map((p) => [p._id.toString(), p.price]));

  cart.cartItems = cart.cartItems
    .map((item) => {
      const price = priceMap.get(String(item.productId));
      if (price === undefined) return null;
      const quantity = Math.max(1, Number(item.quantity || 1));
      return {
        productId: String(item.productId),
        quantity,
        subtotal: price * quantity,
      };
    })
    .filter(Boolean);

  cart.totalPrice = cart.cartItems.reduce((sum, i) => sum + i.subtotal, 0);
  return cart;
};

// [SECTION] Get My Cart
const getMyCart = async (req, res) => {
  try {
    const userId = String(req.user?.id || "");
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({
        message: "Cart fetched successfully",
        data: {
          userId,
          cartItems: [],
          totalPrice: 0,
        },
      });
    }

    return res.status(200).json({
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    console.error("Error from getMyCart:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Add to Cart
const addToCart = async (req, res) => {
  try {
    const userId = String(req.user?.id || "");
    const { productId, quantity } = req.body || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    const qty = Math.max(1, Number(quantity || 1));
    const product = await Product.findOne({ _id: productId, isActive: true }).select(
      "_id price"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        cartItems: [],
        totalPrice: 0,
      });
    }

    const existing = cart.cartItems.find((i) => String(i.productId) === String(productId));
    if (existing) {
      existing.quantity = Math.max(1, Number(existing.quantity || 1) + qty);
    } else {
      cart.cartItems.push({
        productId: String(productId),
        quantity: qty,
        subtotal: product.price * qty,
      });
    }

    await recalcCart(cart);
    const saved = await cart.save();

    return res.status(200).json({
      message: "Cart updated successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error from addToCart:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Update Cart Item
const updateCartItem = async (req, res) => {
  try {
    const userId = String(req.user?.id || "");
    const { productId } = req.params;
    const { quantity } = req.body || {};

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    const qty = Number(quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      return res.status(400).json({ message: "quantity must be >= 1" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.cartItems.find((i) => String(i.productId) === String(productId));
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = qty;
    await recalcCart(cart);
    const saved = await cart.save();

    return res.status(200).json({
      message: "Cart updated successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error from updateCartItem:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Remove Cart Item
const removeCartItem = async (req, res) => {
  try {
    const userId = String(req.user?.id || "");
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Valid productId is required" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.cartItems = cart.cartItems.filter((i) => String(i.productId) !== String(productId));
    await recalcCart(cart);
    const saved = await cart.save();

    return res.status(200).json({
      message: "Item removed successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error from removeCartItem:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Clear Cart
const clearCart = async (req, res) => {
  try {
    const userId = String(req.user?.id || "");
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(200).json({
        message: "Cart cleared successfully",
        data: {
          userId,
          cartItems: [],
          totalPrice: 0,
        },
      });
    }

    cart.cartItems = [];
    cart.totalPrice = 0;
    const saved = await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
      data: saved,
    });
  } catch (error) {
    console.error("Error from clearCart:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export { getMyCart, addToCart, updateCartItem, removeCartItem, clearCart };
