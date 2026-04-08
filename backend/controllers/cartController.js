const Cart = require("../models/cartModel");
const Product = require("../models/productModel");

// Get cart
exports.getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.status(200).json({ success: true, cart: { items: [], total: 0 } });

    const total = cart.items.reduce((acc, item) => {
      return acc + (item.product?.finalPrice || 0) * item.quantity;
    }, 0);

    res.status(200).json({ success: true, cart, total });
  } catch (err) {
    next(err);
  }
};

// Add to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    if (product.stock < quantity)
      return res.status(400).json({ success: false, message: "Insufficient stock" });

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [{ product: productId, quantity }] });
    } else {
      const existingItem = cart.items.find((i) => i.product.toString() === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    await cart.populate("items.product");
    res.status(200).json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// Update cart item quantity
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === req.params.productId);
    if (!item) return res.status(404).json({ success: false, message: "Item not in cart" });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    await cart.populate("items.product");
    res.status(200).json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// Remove from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter((i) => i.product.toString() !== req.params.productId);
    await cart.save();
    await cart.populate("items.product");
    res.status(200).json({ success: true, cart });
  } catch (err) {
    next(err);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });
    res.status(200).json({ success: true, message: "Cart cleared" });
  } catch (err) {
    next(err);
  }
};
