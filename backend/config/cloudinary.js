const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (fileBuffer, fileName) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "carx",
        resource_type: "image",
        transformation: [{ width: 800, height: 600, crop: "limit", quality: "auto" }],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const deleteFromCloudinary = async (imageUrl) => {
  try {
    const parts = imageUrl.split("/");
    const fileName = parts[parts.length - 1].split(".")[0];
    const publicId = `carx/${fileName}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.log("Cloudinary delete error:", err.message);
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
