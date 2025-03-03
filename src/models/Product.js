const mongoose = require('mongoose');
const slugify = require('slugify');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  image: { type: String, required: true },
  publisher: { type: String, required: true },
  publishYear: { type: Number, required: true },
  pages: { type: Number, min: 1, required: true },
  dimensions: { type: String, required: true },
  country: { type: String, required: true },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now },
  slug: { type: String, unique: true }
});

ProductSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Product', ProductSchema);
