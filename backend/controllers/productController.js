const Product = require("../models/productModel");
const { uploadToCloudinary, deleteFromCloudinary } = require("../config/cloudinary");

// Get all products with filters
exports.getAllProducts = async (req, res, next) => {
  try {
    const { keyword, category, minPrice, maxPrice, rating, sort, page = 1, limit = 12 } = req.query;

    const query = {};
    if (keyword) query.name = { $regex: keyword, $options: "i" };
    if (category) query.category = category;
    if (minPrice || maxPrice) {
      query.finalPrice = {};
      if (minPrice) query.finalPrice.$gte = Number(minPrice);
      if (maxPrice) query.finalPrice.$lte = Number(maxPrice);
    }
    if (rating) query.ratings = { $gte: Number(rating) };

    const sortOptions = {
      newest: { createdAt: -1 },
      price_low: { finalPrice: 1 },
      price_high: { finalPrice: -1 },
      rating: { ratings: -1 },
      popular: { totalSales: -1 },
    };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("seller", "name")
      .sort(sortOptions[sort] || { createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      pages: Math.ceil(total / limit),
      currentPage: Number(page),
      products,
    });
  } catch (err) {
    next(err);
  }
};

// Get single product
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate("seller", "name email");
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// Create product (seller only)
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, price, discountPercent, category, stock } = req.body;
    let images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, file.originalname);
        images.push({ url });
      }
    }

    const product = await Product.create({
      name,
      description,
      price,
      discountPercent,
      category,
      stock,
      images,
      seller: req.user.id,
      sellerName: req.user.name,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.seller.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized to update this product" });
    }

    const updates = { ...req.body };

    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      for (const img of product.images) {
        await deleteFromCloudinary(img.url);
      }
      updates.images = [];
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, file.originalname);
        updates.images.push({ url });
      }
    }

    product = await Product.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    if (product.seller.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Delete images from Cloudinary
    for (const img of product.images) {
      await deleteFromCloudinary(img.url);
    }

    await product.deleteOne();
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (err) {
    next(err);
  }
};

// Get seller's own products
exports.getMyProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ seller: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

// Create or update review
exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const existingReview = product.reviews.find(
      (r) => r.user.toString() === req.user.id
    );

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;
    } else {
      product.reviews.push({
        user: req.user.id,
        name: req.user.name,
        rating,
        comment,
      });
      product.numOfReviews = product.reviews.length;
    }

    product.ratings =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

    await product.save();
    res.status(200).json({ success: true, message: "Review submitted" });
  } catch (err) {
    next(err);
  }
};

// Delete review
exports.deleteReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    product.reviews = product.reviews.filter(
      (r) => r._id.toString() !== req.params.reviewId
    );
    product.numOfReviews = product.reviews.length;
    product.ratings = product.reviews.length
      ? product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length
      : 0;

    await product.save();
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};
