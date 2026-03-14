import mongoose from "mongoose";
import Order from "../model/order.js";

// [SECTION] Create Order
const createOrder = async (req, res) => {
  try {
    const { productsOrdered, totalPrice } = req.body;
    const userId = String(req.user?.id || "");

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (!Array.isArray(productsOrdered) || productsOrdered.length === 0) {
      return res.status(400).json({
        message: "productsOrdered is required",
      });
    }

    if (totalPrice === undefined) {
      return res.status(400).json({
        message: "totalPrice is required",
      });
    }

    const newOrder = await Order.create({
      userId,
      productsOrdered,
      totalPrice,
    });

    return res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error from createOrder:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Get All Orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ orderedOn: -1 });
    return res.status(200).json({
      message: "Orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error from getOrders:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Get My Orders
const getMyOrders = async (req, res) => {
  try {
    const userId = String(req.user?.id || "");
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const orders = await Order.find({ userId }).sort({ orderedOn: -1 });
    return res.status(200).json({
      message: "User orders fetched successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error from getMyOrders:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Get Order by ID
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Valid order ID is required",
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    const userId = String(req.user?.id || "");
    if (!req.user?.isAdmin && order.userId !== userId) {
      return res.status(403).json({
        message: "Action forbidden",
      });
    }

    return res.status(200).json({
      message: "Order fetched successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error from getOrder:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Update Order Status
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Valid order ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "status is required",
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after", runValidators: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order status updated successfully",
      data: updatedOrder,
    });
  } catch (error) {
    console.error("Error from updateOrderStatus:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Delete Order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Valid order ID is required",
      });
    }

    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    return res.status(200).json({
      message: "Order deleted successfully",
      data: deletedOrder,
    });
  } catch (error) {
    console.error("Error from deleteOrder:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export {
  createOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
};
