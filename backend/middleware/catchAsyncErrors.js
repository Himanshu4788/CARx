// In your catchAsyncErrors middleware (or inside createProduct catch block):
module.exports = (theFunc) => (req, res, next) => {
  Promise.resolve(theFunc(req, res, next)).catch((err) => {
    console.error("❌ ERROR in createProduct:", err); // ← Add this
    next(err);
  });
};
