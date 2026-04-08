import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProduct, submitReview } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { toggleWishlist } from "../redux/slices/wishlistSlice";
import toast from "react-hot-toast";

const Stars = ({ rating, interactive, onRate }) => (
  <span style={{ fontSize: interactive ? 28 : 14, color: "#f4a261", cursor: interactive ? "pointer" : "default" }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} onClick={() => interactive && onRate(s)} style={{ marginRight: 2 }}>
        {s <= Math.round(rating) ? "★" : "☆"}
      </span>
    ))}
  </span>
);

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading } = useSelector((s) => s.products);
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { products: wishItems } = useSelector((s) => s.wishlist);
  const isWished = wishItems?.some((p) => (p._id || p) === id);

  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [review, setReview] = useState({ rating: 5, comment: "" });

  useEffect(() => { dispatch(fetchProduct(id)); }, [id, dispatch]);

  if (loading || !product) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <div style={{ color: "#666" }}>Loading...</div>
    </div>
  );

  const handleAddToCart = async () => {
    if (!isAuthenticated) return toast.error("Please login first");
    await dispatch(addToCart({ productId: product._id, quantity: qty }));
    toast.success("Added to cart!");
  };

  const handleBuyNow = async () => {
    if (!isAuthenticated) return navigate("/login");
    await dispatch(addToCart({ productId: product._id, quantity: qty }));
    navigate("/checkout");
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) return toast.error("Please login first");
    await dispatch(toggleWishlist(product._id));
    toast.success(isWished ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error("Please login first");
    if (!review.comment.trim()) return toast.error("Please write a comment");
    await dispatch(submitReview({ id: product._id, data: review }));
    toast.success("Review submitted!");
    setReview({ rating: 5, comment: "" });
    dispatch(fetchProduct(id));
  };

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, marginBottom: 60 }}>
        {/* Images */}
        <div>
          <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16, overflow: "hidden", marginBottom: 12, aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <img src={product.images?.[activeImg]?.url || "https://via.placeholder.com/500x375?text=No+Image"} alt={product.name}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: 16 }} />
          </div>
          {product.images?.length > 1 && (
            <div style={{ display: "flex", gap: 8 }}>
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  style={{ width: 72, height: 52, border: `2px solid ${activeImg === i ? "#e63946" : "#2a2a2a"}`, borderRadius: 8, overflow: "hidden", cursor: "pointer", padding: 0, background: "#141414" }}>
                  <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span style={{ fontSize: 11, color: "#e63946", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{product.category}</span>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, color: "#f0f0f0", margin: "8px 0 12px", lineHeight: 1.1 }}>{product.name}</h1>

          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Stars rating={product.ratings} />
            <span style={{ color: "#888", fontSize: 13 }}>{product.ratings?.toFixed(1)} ({product.numOfReviews} reviews)</span>
          </div>

          <div style={{ marginBottom: 20 }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, color: "#e63946" }}>₹{product.finalPrice?.toFixed(0)}</span>
            {product.discountPercent > 0 && (
              <span style={{ color: "#555", fontSize: 18, textDecoration: "line-through", marginLeft: 10 }}>₹{product.price}</span>
            )}
            {product.discountPercent > 0 && (
              <span style={{ background: "rgba(230,57,70,0.1)", color: "#e63946", padding: "3px 10px", borderRadius: 4, fontSize: 13, fontWeight: 700, marginLeft: 10 }}>
                {product.discountPercent}% OFF
              </span>
            )}
          </div>

          <p style={{ color: "#aaa", fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ color: product.stock > 0 ? "#4caf50" : "#e63946", fontWeight: 600, fontSize: 14 }}>
              {product.stock > 0 ? `✓ In Stock (${product.stock})` : "✗ Out of Stock"}
            </span>
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ color: "#888", fontSize: 14 }}>Qty:</span>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden" }}>
                <button onClick={() => setQty(Math.max(1, qty - 1))}
                  style={{ width: 36, height: 36, background: "#1a1a1a", border: "none", color: "white", cursor: "pointer", fontSize: 18 }}>−</button>
                <span style={{ width: 36, textAlign: "center", color: "#f0f0f0", fontSize: 15 }}>{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  style={{ width: 36, height: 36, background: "#1a1a1a", border: "none", color: "white", cursor: "pointer", fontSize: 18 }}>+</button>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button onClick={handleAddToCart} disabled={product.stock === 0} className="btn-outline" style={{ flex: 1, minWidth: 140 }}>Add to Cart</button>
            <button onClick={handleBuyNow} disabled={product.stock === 0} className="btn-primary" style={{ flex: 1, minWidth: 140 }}>Buy Now</button>
            <button onClick={handleWishlist}
              style={{ width: 44, height: 44, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 8, cursor: "pointer", fontSize: 20 }}>
              {isWished ? "❤️" : "🤍"}
            </button>
          </div>

          <div style={{ marginTop: 24, padding: "14px 16px", background: "#0d0d0d", borderRadius: 10, fontSize: 13, color: "#666" }}>
            <div>🚚 Free shipping on orders above ₹999</div>
            <div style={{ marginTop: 4 }}>🔒 Secure payment via Razorpay</div>
            <div style={{ marginTop: 4 }}>↩️ 7-day easy returns</div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="glass-card" style={{ padding: 32 }}>
        <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, color: "#f0f0f0", marginBottom: 24 }}>REVIEWS & RATINGS</h2>

        {/* Write review */}
        {isAuthenticated && (
          <form onSubmit={handleReview} style={{ background: "#0d0d0d", padding: 20, borderRadius: 12, marginBottom: 28 }}>
            <h4 style={{ color: "#f0f0f0", marginBottom: 12 }}>Write a Review</h4>
            <div style={{ marginBottom: 12 }}>
              <label style={{ color: "#888", fontSize: 12, marginBottom: 6, display: "block" }}>Your Rating</label>
              <Stars rating={review.rating} interactive onRate={(r) => setReview({ ...review, rating: r })} />
            </div>
            <textarea value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })}
              placeholder="Share your experience..." rows={3}
              className="input-field" style={{ resize: "vertical", marginBottom: 12 }} />
            <button type="submit" className="btn-primary">Submit Review</button>
          </form>
        )}

        {/* Review list */}
        {product.reviews?.length === 0 ? (
          <p style={{ color: "#666", textAlign: "center", padding: 24 }}>No reviews yet. Be the first!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {product.reviews?.map((r) => (
              <div key={r._id} style={{ borderBottom: "1px solid #1e1e1e", paddingBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 36, height: 36, background: "#e63946", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 700 }}>
                      {r.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: "#f0f0f0", fontWeight: 600, fontSize: 14 }}>{r.name}</div>
                      <Stars rating={r.rating} />
                    </div>
                  </div>
                  <span style={{ color: "#555", fontSize: 12 }}>{new Date(r.createdAt).toLocaleDateString("en-IN")}</span>
                </div>
                <p style={{ color: "#aaa", fontSize: 14, marginLeft: 46 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
