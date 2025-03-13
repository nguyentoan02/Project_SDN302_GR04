const Product = require('../models/Product');
const removeAccents = require('remove-accents');
const User = require('../models/user');

// Xem danh sách sách
exports.listBooks = async (req, res) => {
  try {
    const books = await Product.find();
    res.render('books/list', { books, name: '' }); // Truyền thêm name
  } catch (error) {
    res.status(500).send('Lỗi khi tải danh sách sách');
  }
};

//
exports.filterBooks = async (req, res) => {
  try {
    let { name } = req.query;
    let books = [];

    if (name) {
      name = name.trim(); // Xóa khoảng trắng đầu/cuối
      const nameNormalized = removeAccents(name).toLowerCase();

      books = await Product.find({}).lean();

      // Lọc sách theo điều kiện
      books = books.filter((book) => {
        const bookNameNormalized = removeAccents(book.name).toLowerCase();
        return bookNameNormalized.includes(nameNormalized);
      });
    }

    res.render('books/filter', { books, name });
  } catch (error) {
    console.error('❌ Lỗi khi lọc sách:', error);
    res.status(500).send('Lỗi server');
  }
};

// Xem chi tiết sách - Đã chỉnh sửa để thêm allBooks
exports.bookDetail = async (req, res) => {
  try {
    const book = await Product.findOne({ slug: req.params.slug }).populate({
      path: 'reviews',
      populate: { path: 'userId', select: 'username' }
    });

    if (!book) {
      return res.status(404).send('Không tìm thấy sách');
    }

    const allBooks = await Product.find({ _id: { $ne: book._id } });

    const reviews = book.reviews || [];

    res.render('books/detail', { book, allBooks, reviews });
  } catch (error) {
    console.error('❌ Lỗi khi tải chi tiết sách:', error);
    res.status(500).send('Lỗi server');
  }
};
// Lọc sách theo các tiêu chí (tác giả, thể loại, quốc gia, giá tiền)
exports.filterByAll = async (req, res) => {
  try {
    const { author, category, country, priceRange } = req.query;

    let filter = {};

    // Lọc theo tác giả
    if (author) {
      filter.author = author;
    }

    // Lọc theo thể loại
    if (category) {
      filter.category = category;
    }

    // Lọc theo quốc gia
    if (country) {
      filter.country = country;
    }

    // Lọc theo khoảng giá (priceRange)
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      filter.price = {};
      if (max) {
        // Có cả min và max (ví dụ: 100000-200000)
        filter.price.$gte = min;
        filter.price.$lte = max;
      } else if (priceRange.endsWith('-')) {
        // Chỉ có min, không có max (ví dụ: 500000-)
        filter.price.$gte = min;
      } else {
        // Chỉ có max (ví dụ: 0-50000)
        filter.price.$lte = min;
      }
    }

    const books = await Product.find(filter);

    // Render trang lọc với kết quả
    res.render('books/filterAll', { books, filters: req.query });
  } catch (error) {
    console.error('❌ Lỗi khi lọc sách:', error);
    res.status(500).send('Lỗi server');
  }
};
