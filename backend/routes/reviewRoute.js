const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const { createReview, deleteReview } = require("../controllers/productController");

router.post("/:id", isAuthenticated, createReview);
router.delete("/:productId/:reviewId", isAuthenticated, deleteReview);

module.exports = router;
