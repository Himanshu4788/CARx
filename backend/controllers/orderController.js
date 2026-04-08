const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const Cart = require("../models/cartModel");

// Create order
exports.createOrder = async (req, res, next) => {
  try {
    const { orderItems, shippingAddress, paymentInfo, itemsPrice, shippingPrice, totalPrice } = req.body;

    const order = await Order.create({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentInfo,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    // Update stock & sales
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity, totalSales: item.quantity },
      });
    }

    // Clear cart
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// Get my orders
exports.getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("orderItems.product", "name images")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    next(err);
  }
};

// Get single order
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email").populate("orderItems.product");
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.user._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};

// Admin: get all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    const totalAmount = orders.reduce((acc, o) => acc + o.totalPrice, 0);
    res.status(200).json({ success: true, orders, totalAmount });
  } catch (err) {
    next(err);
  }
};

// Admin: update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (order.orderStatus === "delivered")
      return res.status(400).json({ success: false, message: "Order already delivered" });

    order.orderStatus = req.body.status;
    if (req.body.status === "delivered") order.deliveredAt = Date.now();
    await order.save();
    res.status(200).json({ success: true, order });
  } catch (err) {
    next(err);
  }
};
