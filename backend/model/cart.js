const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User id is required"]
  },
  cartItems: [
    {
      productId: {
        type: String,
        required: [true, 'Product id is required!']
      },
      quantity: {
        type: Number,
        required: [true, "Quantity of products is required!"]
      },
      subtotal: {
        type: Number,
        require: [true, 'Subtotal is required !']
      }
    }
  ],
  totalPrice: {
    type: Number,
    require: [true, 'totalPriceaw is required !']
  },
  orderedOn: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Cart',cartSchema);
