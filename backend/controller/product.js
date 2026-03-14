import mongoose from "mongoose";
import Product from "../model/product.js";
import fs from "fs/promises";
import Path from "path";


// [SECTION] Create Product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, genderType, season, isActive } = req.body;

    if (!name || !description || price === undefined || !genderType || !season) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    if (!req.file?.filename) {
      return res.status(400).json({
        message: "Image is required",
      });
    }

    const image = `/uploads/products/${req.file.filename}`;

    const newProduct = await Product.create({
      name,
      description,
      price,
      image,
      genderType,
      season,
      isActive,
    });

    return res.status(201).json({
      message: "Product created successfully",
      data: newProduct,
    });
  } catch (error) {
    console.error("Error from createProduct:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


// [SECTION] Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdOn: -1 });

    return res.status(200).json({
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error from getProducts:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdOn: -1 });

    return res.status(200).json({
      message: "Active products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error from getActiveProducts:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Search Products by Name
const searchProductsByName = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const products = await Product.find({
      isActive: true,
      name: { $regex: query, $options: "i" },
    }).sort({ createdOn: -1 });

    return res.status(200).json({
      message: "Products searched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Error from searchProductsByName:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Get Product by ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Valid product ID is required",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json({
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error from getProduct:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Update Product
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Valid product ID is required",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const { name, description, price, genderType, season, isActive } = req.body;

    if (name !== undefined) product.name = name;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (genderType !== undefined) product.genderType = genderType;
    if (season !== undefined) product.season = season;
    if (isActive !== undefined) product.isActive = isActive;

    if (req.file?.filename) {
      const oldImage = product.image;
      product.image = `/uploads/products/${req.file.filename}`;

      if (oldImage) {
        const oldPath = Path.join("public", oldImage.replace(/^\/+/, ""));
        await fs.unlink(oldPath).catch(() => {});
      }
    }

    const updatedProduct = await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error from updateProduct:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Delete Product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Valid product ID is required",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);

    if (product.image) {
      const imagePath = Path.join("public", product.image.replace(/^\/+/, ""));
      await fs.unlink(imagePath).catch(() => {});
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    console.error("Error from deleteProduct:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

// [SECTION] Update Product Status
const updateProductStatus = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Valid product ID is required",
      });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.isActive = !product.isActive;
    const updatedProduct = await product.save();

    return res.status(200).json({
      message: `Product ${updatedProduct.isActive ? "activated" : "deactivated"} successfully`,
      data: updatedProduct,
    });
  } catch (error) {
    console.error("Error from updateProductStatus:", error);
    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export {
  createProduct,
  getProducts,
  getActiveProducts,
  searchProductsByName,
  getProduct,
  updateProduct,
  updateProductStatus,
  deleteProduct,
};
