require("dotenv").config({ path: "./config/config.env" });

const app = require("./app");
const connectDB = require("./config/db");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

// Connect to database
connectDB();

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 CarX Server running on port ${process.env.PORT || 5000} in ${process.env.NODE_ENV} mode`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection");
  server.close(() => process.exit(1));
});