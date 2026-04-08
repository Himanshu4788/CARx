const express = require("express");
const router = express.Router();
const { getWishlist, toggleWishlist } = require("../controllers/wishlistController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", isAuthenticated, getWishlist);
router.post("/:productId", isAuthenticated, toggleWishlist);

module.exports = router;
