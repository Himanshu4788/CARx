const express = require("express");
const router = express.Router();
const { createRazorpayOrder, verifyPayment, getRazorpayKey } = require("../controllers/paymentController");
const { isAuthenticated } = require("../middleware/auth");

router.get("/key", isAuthenticated, getRazorpayKey);
router.post("/order", isAuthenticated, createRazorpayOrder);
router.post("/verify", isAuthenticated, verifyPayment);

module.exports = router;
