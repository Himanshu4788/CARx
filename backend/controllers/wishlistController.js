const Wishlist = require("../models/wishlistModel");

exports.getWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user.id }).populate("products");
    res.status(200).json({ success: true, wishlist: wishlist || { products: [] } });
  } catch (err) { next(err); }
};

exports.toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let wishlist = await Wishlist.findOne({ user: req.user.id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user.id, products: [productId] });
      return res.status(200).json({ success: true, added: true, wishlist });
    }

    const exists = wishlist.products.includes(productId);
    if (exists) {
      wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    await wishlist.populate("products");
    res.status(200).json({ success: true, added: !exists, wishlist });
  } catch (err) { next(err); }
};
