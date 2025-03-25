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

    // Kiểm tra nếu user chưa đăng nhập
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'Vui lòng đăng nhập để thêm vào danh sách yêu thích' });
      // Hoặc nếu dùng render, có thể redirect:
      // return res.redirect('/auth');
    }

    // Logic cho user đã đăng nhập
    const user = await User.findById(req.user._id);
    if (!user?.favorites?.includes(productId)) {
      user.favorites.push(productId);
      await user.save();
    }
    return res.json({ message: 'Đã thêm vào danh sách yêu thích' });
  } catch (error) {
    console.error('❌ Lỗi khi thêm vào danh sách yêu thích:', error);
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

exports.getWishlist = async (req, res) => {
  try {
    // Kiểm tra nếu user chưa đăng nhập
    if (!req.user) {
      return res.redirect('/api/auth');
    }
    // Logic cho user đã đăng nhập
    const user = await User.findById(req.user?._id).populate('favorites');
    const products = user.favorites;
    return res.render('favorites/index', { products, isGuest: false });
  } catch (error) {
    console.error('❌ Lỗi khi tải danh sách yêu thích:', error);
    res.status(500).send('Lỗi server');
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;

    // Kiểm tra nếu user chưa đăng nhập
    if (!req.user) {
      return res
        .status(401)
        .json({ message: 'Vui lòng đăng nhập để xóa khỏi danh sách yêu thích' });
      // Hoặc nếu dùng render:
      // return res.redirect('/auth');
    }

    // Logic cho user đã đăng nhập
    const user = await User.findById(req.user._id);
    user.favorites = user.favorites.filter((id) => id.toString() !== productId);
    await user.save();
    return res.json({ message: 'Đã xóa khỏi danh sách yêu thích' });
  } catch (error) {
    console.error('❌ Lỗi khi xóa khỏi danh sách yêu thích:', error);
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};
