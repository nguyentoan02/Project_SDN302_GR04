// models/Product.js
const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    stock: Number,
    category: String,
    image: String, // URL của ảnh sản phẩm
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
  });
  module.exports = mongoose.model('Product', ProductSchema);