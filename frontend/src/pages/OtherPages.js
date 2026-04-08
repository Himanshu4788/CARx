import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/slices/orderSlice";
import { fetchWishlist, toggleWishlist } from "../redux/slices/wishlistSlice";
import { updateProfile } from "../redux/slices/authSlice";
import { addToCart } from "../redux/slices/cartSlice";
import toast from "react-hot-toast";

// ─── ORDER SUCCESS ───────────────────────────────────────────────
export const OrderSuccess = () => (
  <div style={{ textAlign: "center", padding: "100px 20px" }}>
    <div style={{ fontSize: 80, marginBottom: 20, animation: "fadeIn 0.6s ease" }}>🎉</div>
    <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, color: "#f0f0f0", marginBottom: 8 }}>ORDER PLACED!</h1>
    <p style={{ color: "#888", fontSize: 16, marginBottom: 32 }}>Your payment was successful. Your toy cars are on their way!</p>
    <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
      <Link to="/orders"><button className="btn-primary">View My Orders</button></Link>
      <Link to="/products"><button className="btn-outline">Continue Shopping</button></Link>
    </div>
  </div>
);

// ─── ORDERS PAGE ─────────────────────────────────────────────────
export const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  const statusColor = { processing: "#f4a261", shipped: "#4fc3f7", delivered: "#4caf50", cancelled: "#e63946" };

  if (loading) return <div style={{ textAlign: "center", padding: 80, color: "#666" }}>Loading orders...</div>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, color: "#f0f0f0", marginBottom: 32 }}>MY ORDERS</h1>
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>📦</div>
          <h3 style={{ color: "#f0f0f0", marginBottom: 8 }}>No orders yet</h3>
          <Link to="/products"><button className="btn-primary" style={{ marginTop: 12 }}>Start Shopping</button></Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {orders.map((order) => (
            <div key={order._id} className="glass-card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <div style={{ color: "#888", fontSize: 12, marginBottom: 4 }}>ORDER ID</div>
                  <div style={{ color: "#f0f0f0", fontSize: 13, fontFamily: "monospace" }}>#{order._id.slice(-8).toUpperCase()}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ background: `${statusColor[order.orderStatus]}22`, color: statusColor[order.orderStatus], padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: "uppercase" }}>
                    {order.orderStatus}
                  </span>
                  <div style={{ color: "#666", fontSize: 12, marginTop: 6 }}>{new Date(order.createdAt).toLocaleDateString("en-IN")}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                {order.orderItems.map((item) => (
                  <div key={item._id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <img src={item.image} alt={item.name} style={{ width: 44, height: 34, objectFit: "cover", borderRadius: 6, background: "#1a1a1a" }} />
                    <div>
                      <div style={{ color: "#f0f0f0", fontSize: 13 }}>{item.name}</div>
                      <div style={{ color: "#666", fontSize: 12 }}>x{item.quantity} · ₹{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span style={{ color: "#e63946", fontFamily: "'Bebas Neue', cursive", fontSize: 22 }}>₹{order.totalPrice}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── WISHLIST PAGE ───────────────────────────────────────────────
export const WishlistPage = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((s) => s.wishlist);
  const { isAuthenticated } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchWishlist()); }, [dispatch]);

  const handleRemove = async (id) => {
    await dispatch(toggleWishlist(id));
    toast.success("Removed from wishlist");
  };

  const handleAddToCart = async (id) => {
    if (!isAuthenticated) return toast.error("Please login");
    await dispatch(addToCart({ productId: id, quantity: 1 }));
    toast.success("Added to cart!");
  };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, color: "#f0f0f0", marginBottom: 32 }}>
        WISHLIST <span style={{ color: "#666", fontSize: 28 }}>({products.length})</span>
      </h1>
      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🤍</div>
          <h3 style={{ color: "#f0f0f0", marginBottom: 8 }}>Your wishlist is empty</h3>
          <Link to="/products"><button className="btn-primary" style={{ marginTop: 12 }}>Browse Products</button></Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
          {products.map((product) => (
            <div key={product._id} className="glass-card card-hover" style={{ overflow: "hidden" }}>
              <div style={{ position: "relative" }}>
                <img src={product.images?.[0]?.url || "https://via.placeholder.com/300x200"} alt={product.name}
                  style={{ width: "100%", height: 180, objectFit: "cover" }} />
                <button onClick={() => handleRemove(product._id)}
                  style={{ position: "absolute", top: 10, right: 10, background: "rgba(0,0,0,0.6)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 16, color: "#e63946" }}>✕</button>
              </div>
              <div style={{ padding: 16 }}>
                <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                  <h3 style={{ color: "#f0f0f0", fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{product.name}</h3>
                </Link>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#e63946", fontWeight: 700, fontSize: 18 }}>₹{product.finalPrice?.toFixed(0)}</span>
                  <button onClick={() => handleAddToCart(product._id)} className="btn-primary" style={{ padding: "6px 14px", fontSize: 12 }}>+ Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── PROFILE PAGE ────────────────────────────────────────────────
export const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: user?.name || "", address: user?.address || {} });
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(form));
    setSaved(true);
    toast.success("Profile updated!");
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, color: "#f0f0f0", marginBottom: 32 }}>MY PROFILE</h1>
      <div className="glass-card" style={{ padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, background: "#e63946", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "white" }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div style={{ color: "#f0f0f0", fontWeight: 700, fontSize: 18 }}>{user?.name}</div>
            <div style={{ color: "#666", fontSize: 13 }}>{user?.email}</div>
            <span style={{ background: "rgba(230,57,70,0.1)", color: "#e63946", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>{user?.role}</span>
          </div>
        </div>
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>NAME</label>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>CITY</label>
            <input className="input-field" placeholder="Your city" value={form.address?.city || ""}
              onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
          </div>
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>STATE</label>
            <input className="input-field" placeholder="Your state" value={form.address?.state || ""}
              onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} />
          </div>
          <button type="submit" className="btn-primary" style={{ padding: 12, marginTop: 8 }}>
            {saved ? "✓ Saved!" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── NOT FOUND ───────────────────────────────────────────────────
export const NotFound = () => (
  <div style={{ textAlign: "center", padding: "100px 20px" }}>
    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 120, color: "#e63946", lineHeight: 1 }}>404</div>
    <h2 style={{ color: "#f0f0f0", fontSize: 28, marginBottom: 12 }}>Page Not Found</h2>
    <p style={{ color: "#666", marginBottom: 28 }}>The page you're looking for doesn't exist.</p>
    <Link to="/"><button className="btn-primary">Back to Home</button></Link>
  </div>
);

export default OrderSuccess;
