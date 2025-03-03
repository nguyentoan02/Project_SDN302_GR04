const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { authMiddleware, checkUserRole } = require("../middleware/auth");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");
const { registerRoute } = require("./register.routes");
const globalAsyncHandler = require("../middleware/handler");

globalAsyncHandler(router);

router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Chỉ admin mới có thể thêm, cập nhật, xóa sản phẩm
router.post("/", upload.single("image"), createProduct);
router.put("/:id", authMiddleware, checkUserRole("admin"), upload.single("image"), updateProduct);
router.delete("/:id", authMiddleware, checkUserRole("admin"), deleteProduct);

registerRoute("/products",router);

module.exports = router;
