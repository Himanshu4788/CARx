const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // Mongoose CastError (wrong ID format)
  if (err.name === "CastError") {
    error.message = `Resource not found. Invalid: ${err.path}`;
    error.statusCode = 404;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `${field} already exists`;
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error.message = "Invalid token. Please login again.";
    error.statusCode = 401;
  }
  if (err.name === "TokenExpiredError") {
    error.message = "Token expired. Please login again.";
    error.statusCode = 401;
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    error.message = Object.values(err.errors).map((e) => e.message).join(", ");
    error.statusCode = 400;
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message || "Internal Server Error",
  });
};

module.exports = errorMiddleware;
