const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter product name"],
      trim: true,
      maxLength: [100, "Name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Please enter product description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter product price"],
      min: [0, "Price cannot be negative"],
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    finalPrice: {
      type: Number,
    },
    category: {
      type: String,
      required: [true, "Please enter product category"],
      enum: ["sports", "vintage", "electric", "military", "Premium", "Bikes" ,"Other"],
    },
    images: [
      {
        url: { type: String, required: true },
      },
    ],
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      min: [0, "Stock cannot be negative"],
      default: 1,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerName: String,
    ratings: { type: Number, default: 0 },
    numOfReviews: { type: Number, default: 0 },
    reviews: [reviewSchema],
    totalSales: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Calculate finalPrice before saving (create)
productSchema.pre("save", function (next) {
  const discount = this.discountPercent || 0;
  this.finalPrice = Math.round(this.price - (this.price * discount) / 100);
  next();
});

// Calculate finalPrice before findOneAndUpdate
productSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.price !== undefined || update.discountPercent !== undefined) {
    const price = update.price ?? this._update?.price;
    const discount = update.discountPercent ?? 0;
    if (price !== undefined) {
      update.finalPrice = Math.round(price - (price * discount) / 100);
      this.setUpdate(update);
    }
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);