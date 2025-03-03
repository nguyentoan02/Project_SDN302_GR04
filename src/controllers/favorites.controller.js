const User = require('../models/user');
const Product = require('../models/Product');

exports.addToWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;
    if (!productId || typeof productId !== 'string') {
      throw new Error('Invalid product ID');
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Sản phẩm không tồn tại');
    }

    // Sử dụng session để lưu wishlist cho guest
    req.session.wishlist = req.session.wishlist || [];
    if (!req.session.wishlist.includes(productId)) {
      req.session.wishlist.push(productId);
    }
    return res.json({ message: 'Đã thêm vào danh sách yêu thích (khách)' });
  } catch (error) {
    console.error('❌ Lỗi khi thêm vào danh sách yêu thích:', error);
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    // Lấy danh sách từ session
    const wishlist = req.session.wishlist || [];
    const products = await Product.find({ _id: { $in: wishlist } });
    return res.render('favorites/index', { products, isGuest: true });
  } catch (error) {
    console.error('❌ Lỗi khi tải danh sách yêu thích:', error);
    res.status(500).send('Lỗi server');
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Sử dụng session để lưu wishlist cho guest
    req.session.wishlist = req.session.wishlist || [];
    req.session.wishlist = req.session.wishlist.filter((id) => id.toString() !== productId);
    return res.json({ message: 'Đã xóa khỏi danh sách yêu thích (khách)' });
  } catch (error) {
    console.error('❌ Lỗi khi xóa khỏi danh sách yêu thích:', error);
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};
