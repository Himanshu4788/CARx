const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);

// Routes
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/products", require("./routes/productRoute"));
app.use("/api/v1/cart", require("./routes/cartRoute"));
app.use("/api/v1/orders", require("./routes/orderRoute"));
app.use("/api/v1/payment", require("./routes/paymentRoute"));
app.use("/api/v1/wishlist", require("./routes/wishlistRoute"));
app.use("/api/v1/reviews", require("./routes/reviewRoute"));

// Error middleware
app.use(require("./middleware/error"));

module.exports = app;
