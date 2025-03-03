const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const { SuccessResponse } = require('../core/success');
const { BadRequest, AppError } = require('../core/error');

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
  try {
    let { page, limit } = req.query;

    // Chuyển đổi thành số nguyên, mặc định page = 1, limit = 3
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 3;
    const skip = (page - 1) * limit;

    // Lấy danh sách sản phẩm có phân trang
    const products = await Product.find().skip(skip).limit(limit);

    // Lấy tổng số sản phẩm
    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      status: 'success',
      message: 'Products retrieved successfully',
      data: products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalProducts / limit),
        totalProducts: totalProducts
      }
    });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

// Lấy chi tiết sản phẩm
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Thêm sản phẩm
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Validate required fields
    if (!name || !price || !stock || !category) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Missing required fields' 
      });
    }

    if (!req.file) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Vui lòng tải ảnh lên' 
      });
    }

    // Upload ảnh lên Cloudinary
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'products' }, async (error, result) => {
          if (error) {
            return res.status(500).json({
              status: 'error', 
              message: 'Error uploading image'
            });
          }

          try {
            const product = new Product({
             ...req.body,
              image: result.secure_url
            });

            const productRs = await product.save();
            
            return res.status(200).json({
              status: 'success',
              message: 'Sản phẩm đã được tạo!',
              data: productRs
            });

          } catch (err) {
            return res.status(500).json({
              status: 'error',
              message: err.message
            });
          }
        })
        .end(req.file.buffer);
    });

  } catch (error) {
    return res.status(500).json({
      status: 'error', 
      message: error.message
    });
  }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

    // Nếu có ảnh mới -> upload lên Cloudinary
    if (req.file) {
      const uploadResponse = await cloudinary.uploader.upload_stream(
        { folder: 'products' },
        async (error, result) => {
          if (error) return res.status(500).json({ message: 'Lỗi upload ảnh', error });

          product.image = result.secure_url;
          product.name = name || product.name;
          product.description = description || product.description;
          product.price = price || product.price;
          product.stock = stock || product.stock;
          product.category = category || product.category;

          await product.save();
          res.status(200).json({ message: 'Sản phẩm đã được cập nhật', product });
        }
      );

      req.file.stream.pipe(uploadResponse);
    } else {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.stock = stock || product.stock;
      product.category = category || product.category;

      await product.save();
      res.status(200).json({ message: 'Sản phẩm đã được cập nhật', product });
    }
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

    await product.remove();
    res.status(200).json({ message: 'Sản phẩm đã bị xóa' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server', error });
  }
};
