const mongoose = require("mongoose");

const connectDatabase = () => {
//   console.log(process.env.CLOUDINARY_API_KEY);
// console.log(process.env.CLOUDINARY_API_NAME);
// console.log(process.env.CLOUDINARY_API_SECRET);

  mongoose
    .connect(process.env.DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex is deprecated in newer versions
    })
    .then((data) => {
      console.log(`MongoDB connected with server: ${data.connection.host}`);
    })
    .catch((err) => {
      console.error("Database connection error:", err.message);
      process.exit(1); // Exit with failure
    });
};

module.exports = connectDatabase;
