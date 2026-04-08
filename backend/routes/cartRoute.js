// cartRoute.js
const express = require("express");
const router = express.Router();
const { getCart, addToCart, updateCartItem, removeFromCart, clearCart } = require("../controllers/cartController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, getCart);
router.post("/", isAuthenticated, addToCart);
router.put("/:productId", isAuthenticated, updateCartItem);
router.delete("/:productId", isAuthenticated, removeFromCart);
router.delete("/", isAuthenticated, clearCart);

module.exports = router;
