import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, updateCartItem, removeFromCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading } = useSelector((s) => s.cart);
  const [localQty, setLocalQty] = useState({});
  const [updating, setUpdating] = useState({});

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  useEffect(() => {
    const qtyMap = {};
    items.forEach(({ product, quantity }) => {
      if (product) qtyMap[product._id] = quantity;
    });
    setLocalQty(qtyMap);
  }, [items]);

  const calculateTotal = () =>
    items.reduce((acc, { product, quantity }) => {
      if (!product) return acc;
      const qty = localQty[product._id] ?? quantity;
      return acc + (product.finalPrice || 0) * qty;
    }, 0);

  const total = calculateTotal();
  const shipping = total >= 999 ? 0 : 79;
  const grandTotal = total + shipping;
  const totalItems = items.reduce((acc, { product, quantity }) => {
    if (!product) return acc;
    return acc + (localQty[product._id] ?? quantity);
  }, 0);

  const handleIncrease = async (product, currentQty) => {
    if (currentQty >= product.stock) return toast.error(`Only ${product.stock} in stock!`);
    const newQty = currentQty + 1;
    setLocalQty((p) => ({ ...p, [product._id]: newQty }));
    setUpdating((p) => ({ ...p, [product._id]: true }));
    await dispatch(updateCartItem({ productId: product._id, quantity: newQty }));
    setUpdating((p) => ({ ...p, [product._id]: false }));
  };

  const handleDecrease = async (product, currentQty) => {
    if (currentQty <= 1) { handleRemove(product._id, product.name); return; }
    const newQty = currentQty - 1;
    setLocalQty((p) => ({ ...p, [product._id]: newQty }));
    setUpdating((p) => ({ ...p, [product._id]: true }));
    await dispatch(updateCartItem({ productId: product._id, quantity: newQty }));
    setUpdating((p) => ({ ...p, [product._id]: false }));
  };

  const handleRemove = async (productId, name) => {
    await dispatch(removeFromCart(productId));
    toast.success(`${name || "Item"} removed`);
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", flexDirection: "column", gap: 12 }}>
      <div style={{ width: 40, height: 40, border: "3px solid #1e1e1e", borderTop: "3px solid #e63946", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ color: "#666", fontSize: 14 }}>Loading cart...</span>
    </div>
  );

  if (items.length === 0) return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🛒</div>
      <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, color: "#f0f0f0", marginBottom: 8 }}>CART IS EMPTY</h2>
      <p style={{ color: "#666", marginBottom: 24 }}>Add some awesome toy cars!</p>
      <Link to="/products"><button className="btn-primary" style={{ padding: "12px 32px" }}>Browse Products</button></Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 16px", boxSizing: "border-box", width: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, color: "#f0f0f0", margin: 0 }}>YOUR CART</h1>
        <p style={{ color: "#666", fontSize: 13, marginTop: 4 }}>{totalItems} {totalItems === 1 ? "item" : "items"} in your cart</p>
      </div>

      {/* Layout */}
      <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* Cart Items — takes remaining space */}
        <div style={{ flex: "1 1 500px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {items.map(({ product, quantity }) => {
            if (!product) return null;
            const qty = localQty[product._id] ?? quantity;
            const itemTotal = (product.finalPrice || 0) * qty;
            const isUpdating = updating[product._id];
            const atMax = qty >= product.stock;

            return (
              <div key={product._id} style={{
                background: "#141414", border: "1px solid #2a2a2a", borderRadius: 14,
                padding: "14px 16px", display: "flex", gap: 14, alignItems: "center",
                opacity: isUpdating ? 0.7 : 1, transition: "opacity 0.2s",
                position: "relative", overflow: "hidden", boxSizing: "border-box"
              }}>
                {/* Red left border */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#e63946" }} />

                {/* Image */}
                <Link to={`/product/${product._id}`} style={{ flexShrink: 0 }}>
                  <img src={product.images?.[0]?.url || "https://via.placeholder.com/80x60"}
                    alt={product.name}
                    style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 10, background: "#1a1a1a", display: "block" }} />
                </Link>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                    <h3 style={{ color: "#f0f0f0", fontSize: 14, fontWeight: 600, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {product.name}
                    </h3>
                  </Link>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ background: "rgba(230,57,70,0.1)", color: "#e63946", padding: "1px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: "capitalize" }}>
                      {product.category}
                    </span>
                    {product.stock <= 5 && (
                      <span style={{ color: "#f4a261", fontSize: 10, fontWeight: 600 }}>Only {product.stock} left!</span>
                    )}
                  </div>
                  <div style={{ color: "#555", fontSize: 12, marginTop: 4 }}>
                    ₹{product.finalPrice?.toFixed(0)} × {qty} = <span style={{ color: "#e63946", fontWeight: 700 }}>₹{itemTotal.toFixed(0)}</span>
                  </div>
                </div>

                {/* Qty Controls */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flexShrink: 0 }}>
                  <span style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: 1 }}>QTY</span>
                  <div style={{ display: "flex", alignItems: "center", border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden", background: "#0d0d0d" }}>
                    <button onClick={() => handleDecrease(product, qty)} disabled={isUpdating}
                      style={{ width: 34, height: 34, background: "transparent", border: "none", color: qty <= 1 ? "#e63946" : "#aaa", cursor: "pointer", fontSize: 16, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {qty <= 1 ? "🗑" : "−"}
                    </button>
                    <div style={{ width: 36, height: 34, display: "flex", alignItems: "center", justifyContent: "center", color: "#f0f0f0", fontSize: 15, fontWeight: 700, borderLeft: "1px solid #2a2a2a", borderRight: "1px solid #2a2a2a" }}>
                      {isUpdating
                        ? <div style={{ width: 14, height: 14, border: "2px solid #333", borderTop: "2px solid #e63946", borderRadius: "50%", animation: "spin 0.6s linear infinite" }} />
                        : qty}
                    </div>
                    <button onClick={() => handleIncrease(product, qty)} disabled={isUpdating || atMax}
                      style={{ width: 34, height: 34, background: "transparent", border: "none", color: atMax ? "#333" : "#aaa", cursor: atMax ? "not-allowed" : "pointer", fontSize: 18, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      +
                    </button>
                  </div>
                  {atMax && <span style={{ color: "#f4a261", fontSize: 9, fontWeight: 700 }}>MAX</span>}
                </div>

                {/* Item Total */}
                <div style={{ textAlign: "right", flexShrink: 0, minWidth: 64 }}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: "#e63946", lineHeight: 1 }}>₹{itemTotal.toFixed(0)}</div>
                  {product.discountPercent > 0 && (
                    <div style={{ color: "#444", fontSize: 11, textDecoration: "line-through" }}>₹{(product.price * qty).toFixed(0)}</div>
                  )}
                </div>

                {/* Remove */}
                <button onClick={() => handleRemove(product._id, product.name)} disabled={isUpdating}
                  style={{ background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.2)", color: "#e63946", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 13, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#e63946"; e.currentTarget.style.color = "white"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(230,57,70,0.08)"; e.currentTarget.style.color = "#e63946"; }}>
                  ✕
                </button>
              </div>
            );
          })}

          <Link to="/products" style={{ textDecoration: "none", color: "#666", fontSize: 13, display: "inline-flex", alignItems: "center", gap: 4, marginTop: 4 }}
            onMouseEnter={e => e.currentTarget.style.color = "#e63946"}
            onMouseLeave={e => e.currentTarget.style.color = "#666"}>
            ← Continue Shopping
          </Link>
        </div>

        {/* Order Summary — fixed width */}
        <div style={{ width: 300, flexShrink: 0, position: "sticky", top: 80 }}>
          <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16, overflow: "hidden" }}>
            {/* Header */}
            <div style={{ background: "linear-gradient(135deg, #e63946, #c1121f)", padding: "14px 20px" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: "white", margin: 0 }}>ORDER SUMMARY</h3>
            </div>

            <div style={{ padding: 20 }}>
              {/* Item breakdown */}
              <div style={{ marginBottom: 14 }}>
                {items.map(({ product, quantity }) => {
                  if (!product) return null;
                  const qty = localQty[product._id] ?? quantity;
                  return (
                    <div key={product._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 12 }}>
                      <span style={{ color: "#777", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 160 }}>
                        {product.name} ×{qty}
                      </span>
                      <span style={{ color: "#f0f0f0", fontWeight: 600, marginLeft: 8, flexShrink: 0 }}>
                        ₹{((product.finalPrice || 0) * qty).toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#777", fontSize: 13, marginBottom: 8 }}>
                  <span>Subtotal ({totalItems} items)</span>
                  <span style={{ color: "#f0f0f0" }}>₹{total.toFixed(0)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 12 }}>
                  <span style={{ color: "#777" }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? "#4caf50" : "#f0f0f0", fontWeight: shipping === 0 ? 700 : 400 }}>
                    {shipping === 0 ? "🎉 FREE" : `₹${shipping}`}
                  </span>
                </div>

                {/* Free shipping bar */}
                {shipping > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ color: "#555", fontSize: 11, marginBottom: 5 }}>₹{(999 - total).toFixed(0)} more for FREE shipping</div>
                    <div style={{ background: "#1a1a1a", borderRadius: 10, height: 5, overflow: "hidden" }}>
                      <div style={{ background: "linear-gradient(90deg, #e63946, #f4a261)", width: `${Math.min((total / 999) * 100, 100)}%`, height: "100%", borderRadius: 10, transition: "width 0.4s ease" }} />
                    </div>
                  </div>
                )}

                {/* Total */}
                <div style={{ background: "#0d0d0d", borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #1e1e1e" }}>
                  <span style={{ color: "#f0f0f0", fontWeight: 700 }}>TOTAL</span>
                  <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, color: "#e63946", lineHeight: 1 }}>₹{grandTotal.toFixed(0)}</span>
                </div>

                <button onClick={() => navigate("/checkout")} className="btn-primary"
                  style={{ width: "100%", padding: "13px", fontSize: 15, borderRadius: 10, letterSpacing: 0.5 }}>
                  Proceed to Checkout →
                </button>

                {/* Trust badges */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginTop: 12 }}>
                  {[["🔒", "Secure Pay"], ["↩️", "Easy Returns"], ["🚚", "Fast Ship"], ["✅", "Genuine"]].map(([icon, label]) => (
                    <div key={label} style={{ background: "#0d0d0d", borderRadius: 7, padding: "6px 8px", display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={{ fontSize: 12 }}>{icon}</span>
                      <span style={{ color: "#555", fontSize: 10, fontWeight: 600 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default CartPage;