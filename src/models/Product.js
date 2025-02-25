const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    stock: {
      type: Number,
      required: [true, 'Stock quantity is required'],
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    category: {
      type: String,
      default: 'uncategorized'
    },
    image: {
      type: String,
      default: ''
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Product', ProductSchema);
