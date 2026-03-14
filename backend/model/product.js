import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  description: {
    type: String,
    required: [true, "Description is required"],
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
  },

  image: {
    type: String,
    required: [true, "Image is required"],
  },

  genderType: {
    type: String,
    enum: ["male", "female", "other"],
    required: [true, "Gender type is required"],
  },

  season: {
    type: String,
    enum: ["summer", "winter"],
    required: [true, "Season is required"],
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  createdOn: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
