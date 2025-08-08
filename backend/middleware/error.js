const ErrorHandler = require("../utils/errorhander"); // ⚠️ make sure filename is correct (not errorhander)

module.exports = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Wrong Mongodb Id error
  if (err.name === "CastError") {
    message = `Resource not found. Invalid: ${err.path}`;
    statusCode = 400;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    statusCode = 400;
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    message = `Json Web Token is invalid, Try again `;
    statusCode = 400;
  }

  // JWT EXPIRE error
  if (err.name === "TokenExpiredError") {
    message = `Json Web Token is Expired, Try again `;
    statusCode = 400;
  }

  // 🔴 Add this to actually see the problem in backend logs
  console.error("❌ ERROR:", err);

  res.status(statusCode).json({
    success: false,
    message,
  });
};
