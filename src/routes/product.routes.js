const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { authMiddleware, checkUserRole } = require("../middleware/auth");
const Product = require("../models/Product"); // Ensure Product model is imported
const cloudinary = require("../config/cloudinary"); // Import Cloudinary configuration
const User = require("../models/user"); // Ensure User model is imported
const mongoose = require("mongoose");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  exportProductsToExcel
} = require("../controllers/product.controller");
const { registerRoute } = require("./register.routes");
const globalAsyncHandler = require("../middleware/handler");

globalAsyncHandler(router);

router.get("/users",async (req, res) => {
  try {
    const users = await User.find();
    res.render("AdminUsers/userlist", { users });
  } catch (error) {
    res.status(500).send("Error retrieving users");
  }
});

router.post("/users/lock/:id",  async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.lock = true;
    await user.save();
    res.redirect("/api/products/users");
  } catch (error) {
    res.status(500).send("Error locking user");
  }
});

router.post("/users/unlock/:id",  async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    user.lock = false;
    await user.save();
    res.redirect("/api/products/users");
  } catch (error) {
    res.status(500).send("Error unlocking user");
  }
});

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || "";

    const products = await Product.find({ name: { $regex: searchQuery, $options: "i" } })
      .skip(skip)
      .limit(limit);
    const totalProducts = await Product.countDocuments({ name: { $regex: searchQuery, $options: "i" } });
    const totalPages = Math.ceil(totalProducts / limit);

    res.render("AdminProducts/home", { products, page, totalPages, searchQuery });
  } catch (error) {
    res.status(500).send("Error retrieving products");
  }
});

router.get("/add", (req, res) => {
  res.render("AdminProducts/add");
});

router.post("/add", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      code,
      author,
      category,
      price,
      stock,
      publisher,
      publishYear,
      pages,
      dimensions,
      country
    } = req.body;

    if (!name || !code || !author || !category || !price || !stock || !publisher || !publishYear || !pages || !dimensions || !country) {
      return res.status(400).json({
        status: 'error',
        message: 'Missing required fields',
        required: [
          'name',
          'code',
          'author',
          'category',
          'price',
          'stock',
          'publisher',
          'publishYear',
          'pages',
          'dimensions',
          'country'
        ]
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: 'error',
        message: 'Please upload an image'
      });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(req.file.buffer);
    });

    const product = new Product({
      name,
      code,
      author,
      category,
      price,
      stock,
      publisher,
      publishYear,
      pages,
      dimensions,
      country,
      image: result.secure_url
    });

    const productRs = await product.save();

    res.redirect("/api/products");
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

router.get("/edit/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("AdminProducts/edit", { product });
  } catch (error) {
    res.status(500).send("Error retrieving product");
  }
});

router.post("/edit/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      name,
      code,
      author,
      category,
      price,
      stock,
      publisher,
      publishYear,
      pages,
      dimensions,
      country,
      description // Add description to the destructured fields
    } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Update fields if provided
    if (name) product.name = name;
    if (code) product.code = code;
    if (author) product.author = author;
    if (category) product.category = category;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (publisher) product.publisher = publisher;
    if (publishYear) product.publishYear = publishYear;
    if (pages) product.pages = pages;
    if (dimensions) product.dimensions = dimensions;
    if (country) product.country = country;
    if (description) product.description = description; // Update description if provided

    // Handle image upload if new image is provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: 'products' }, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }).end(req.file.buffer);
      });

      product.image = result.secure_url;
    }

    const updatedProduct = await product.save();

    res.redirect("/api/products");
  } catch (error) {
    res.status(500).send("Error updating product");
  }
});

router.get("/view/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.render("AdminProducts/view", { product });
  } catch (error) {
    res.status(500).send("Error retrieving product");
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    await product.remove();
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).send("Error deleting product");
  }
});

router.get("/export", exportProductsToExcel);

// router.get("/:id", getProductById);

// // Chỉ admin mới có thể thêm, cập nhật, xóa sản phẩm
// router.post("/", upload.single("image"), createProduct);
// router.put("/:id",  upload.single("image"), updateProduct);
// router.delete("/:id", authMiddleware, checkUserRole("admin"), deleteProduct);

registerRoute("/products",router);

module.exports = router;
