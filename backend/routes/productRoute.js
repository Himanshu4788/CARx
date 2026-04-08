const express = require("express");
const router = express.Router();
const {
  getAllProducts, getProduct, createProduct, updateProduct,
  deleteProduct, getMyProducts, createReview, deleteReview,
} = require("../controllers/productController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/multer");

router.get("/", getAllProducts);
router.get("/my", isAuthenticated, authorizeRoles("seller", "admin"), getMyProducts);
router.get("/:id", getProduct);
router.post("/", isAuthenticated, authorizeRoles("seller", "admin"), upload.array("images", 5), createProduct);
router.put("/:id", isAuthenticated, upload.array("images", 5), updateProduct);
router.delete("/:id", isAuthenticated, deleteProduct);
router.post("/:id/review", isAuthenticated, createReview);
router.delete("/:productId/review/:reviewId", isAuthenticated, deleteReview);

module.exports = router;
