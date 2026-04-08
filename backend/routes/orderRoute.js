const express = require("express");
const router = express.Router();
const { createOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus } = require("../controllers/orderController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");

router.post("/", isAuthenticated, createOrder);
router.get("/my", isAuthenticated, getMyOrders);
router.get("/admin/all", isAuthenticated, authorizeRoles("admin"), getAllOrders);
router.get("/:id", isAuthenticated, getOrder);
router.put("/:id/status", isAuthenticated, authorizeRoles("admin"), updateOrderStatus);

module.exports = router;
