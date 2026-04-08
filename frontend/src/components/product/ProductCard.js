import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlist } from "../../redux/slices/wishlistSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import toast from "react-hot-toast";

const Stars = ({ rating }) => (
  <span style={{ color: "#f4a261", fontSize: 12, letterSpacing: 1 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s}>{s <= Math.round(rating) ? "★" : "☆"}</span>
    ))}
  </span>
);

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((s) => s.auth);
  const { products: wishItems } = useSelector((s) => s.wishlist);
  const isWished = wishItems?.some((p) => (p._id || p) === product._id);
  const [addingToCart, setAddingToCart] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error("Please login first");
    await dispatch(toggleWishlist(product._id));
    toast.success(isWished ? "Removed from wishlist" : "Added to wishlist ❤️");
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error("Please login first");
    if (product.stock === 0) return toast.error("Out of stock!");
    setAddingToCart(true);
    await dispatch(addToCart({ productId: product._id, quantity: 1 }));
    toast.success("Added to cart! 🛒");
    setAddingToCart(false);
  };

  const img = product.images?.[0]?.url || "https://via.placeholder.com/300x200?text=No+Image";
  const savings = product.discountPercent > 0 ? (product.price - product.finalPrice).toFixed(0) : 0;

  return (
    <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
      <div style={{
        background: "#141414",
        border: "1px solid #2a2a2a",
        borderRadius: 16,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(230,57,70,0.15)"; e.currentTarget.style.borderColor = "#e63946"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.borderColor = "#2a2a2a"; }}
      >
        {/* Image */}
        <div style={{ position: "relative", paddingTop: "68%", overflow: "hidden", background: "#1a1a1a" }}
          onMouseEnter={() => setImgHovered(true)}
          onMouseLeave={() => setImgHovered(false)}>
          <img src={img} alt={product.name}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s ease", transform: imgHovered ? "scale(1.08)" : "scale(1)" }} />

          {/* Gradient overlay */}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)", pointerEvents: "none" }} />

          {/* Badges */}
          <div style={{ position: "absolute", top: 10, left: 10, display: "flex", flexDirection: "column", gap: 4 }}>
            {product.discountPercent > 0 && (
              <span style={{ background: "#e63946", color: "white", fontSize: 11, fontWeight: 800, padding: "3px 9px", borderRadius: 6 }}>
                -{product.discountPercent}%
              </span>
            )}
            {product.totalSales > 10 && (
              <span style={{ background: "rgba(244,162,97,0.9)", color: "#0a0a0a", fontSize: 10, fontWeight: 800, padding: "3px 8px", borderRadius: 6 }}>
                🔥 POPULAR
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button onClick={handleWishlist}
            style={{
              position: "absolute", top: 10, right: 10,
              background: isWished ? "#e63946" : "rgba(0,0,0,0.6)",
              border: "none", borderRadius: "50%", width: 36, height: 36,
              cursor: "pointer", fontSize: 16, display: "flex",
              alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)", transition: "all 0.2s",
              boxShadow: isWished ? "0 0 12px rgba(230,57,70,0.5)" : "none"
            }}>
            {isWished ? "❤️" : "🤍"}
          </button>

          {/* Out of stock overlay */}
          {product.stock === 0 && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ background: "#e63946", color: "white", padding: "6px 16px", borderRadius: 6, fontWeight: 800, fontSize: 13, letterSpacing: 1 }}>OUT OF STOCK</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 10, color: "#e63946", fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", background: "rgba(230,57,70,0.1)", padding: "2px 8px", borderRadius: 4 }}>
              {product.category}
            </span>
            {product.stock > 0 && product.stock <= 5 && (
              <span style={{ fontSize: 10, color: "#f4a261", fontWeight: 600 }}>Only {product.stock} left</span>
            )}
          </div>

          <h3 style={{ color: "#f0f0f0", fontSize: 15, fontWeight: 600, margin: "0 0 8px", fontFamily: "'Outfit', sans-serif", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: 1.4, flex: 1 }}>
            {product.name}
          </h3>

          {/* Rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <Stars rating={product.ratings} />
            <span style={{ color: "#555", fontSize: 11 }}>({product.numOfReviews})</span>
          </div>

          {/* Price + Cart */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                <span style={{ color: "#e63946", fontWeight: 800, fontSize: 20, fontFamily: "'Bebas Neue', cursive", letterSpacing: 1 }}>
                  ₹{product.finalPrice?.toFixed(0)}
                </span>
                {product.discountPercent > 0 && (
                  <span style={{ color: "#444", fontSize: 12, textDecoration: "line-through" }}>₹{product.price}</span>
                )}
              </div>
              {savings > 0 && (
                <div style={{ color: "#4caf50", fontSize: 11, fontWeight: 600 }}>You save ₹{savings}</div>
              )}
            </div>

            <button onClick={handleAddToCart}
              disabled={product.stock === 0 || addingToCart}
              style={{
                background: product.stock === 0 ? "#222" : addingToCart ? "#c1121f" : "#e63946",
                color: product.stock === 0 ? "#444" : "white",
                border: "none", borderRadius: 10, padding: "8px 14px",
                fontSize: 13, fontWeight: 700, cursor: product.stock === 0 ? "not-allowed" : "pointer",
                transition: "all 0.2s", whiteSpace: "nowrap",
                transform: addingToCart ? "scale(0.95)" : "scale(1)"
              }}>
              {addingToCart ? "✓ Added!" : product.stock === 0 ? "Sold Out" : "+ Cart"}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;