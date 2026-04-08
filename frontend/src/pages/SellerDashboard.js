import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProducts, deleteProduct } from "../redux/slices/productSlice";
import toast from "react-hot-toast";

const SellerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myProducts, loading } = useSelector((s) => s.products);
  const { user } = useSelector((s) => s.auth);

  useEffect(() => { dispatch(fetchMyProducts()); }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await dispatch(deleteProduct(id));
    toast.success("Product deleted");
  };

  const totalStock = myProducts.reduce((a, p) => a + p.stock, 0);
  const totalSales = myProducts.reduce((a, p) => a + p.totalSales, 0);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, color: "#f0f0f0" }}>SELLER DASHBOARD</h1>
          <p style={{ color: "#666" }}>Welcome back, {user?.name}</p>
        </div>
        <button onClick={() => navigate("/seller/product/new")} className="btn-primary" style={{ padding: "12px 24px" }}>
          + Add Product
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 36 }}>
        {[
          { label: "Total Products", value: myProducts.length, icon: "📦" },
          { label: "Total Stock", value: totalStock, icon: "🏪" },
          { label: "Total Sales", value: totalSales, icon: "📈" },
          { label: "Avg. Rating", value: myProducts.length ? (myProducts.reduce((a, p) => a + p.ratings, 0) / myProducts.length).toFixed(1) : "N/A", icon: "⭐" },
        ].map(({ label, value, icon }) => (
          <div key={label} className="glass-card" style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 36, color: "#e63946" }}>{value}</div>
            <div style={{ color: "#666", fontSize: 12, fontWeight: 600, letterSpacing: 1 }}>{label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="glass-card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid #2a2a2a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, color: "#f0f0f0" }}>MY PRODUCTS</h3>
          <span style={{ color: "#666", fontSize: 13 }}>{myProducts.length} products</span>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 48, color: "#666" }}>Loading products...</div>
        ) : myProducts.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
            <h3 style={{ color: "#f0f0f0", marginBottom: 8 }}>No products yet</h3>
            <p style={{ color: "#666", marginBottom: 20 }}>Start selling by adding your first toy car!</p>
            <Link to="/seller/product/new"><button className="btn-primary">Add Your First Product</button></Link>
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#0d0d0d" }}>
                  {["Product", "Category", "Price", "Stock", "Sales", "Rating", "Actions"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: "#666", fontSize: 11, fontWeight: 700, letterSpacing: 1, borderBottom: "1px solid #2a2a2a" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {myProducts.map((product) => (
                  <tr key={product._id} style={{ borderBottom: "1px solid #1e1e1e" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#0f0f0f"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img src={product.images?.[0]?.url || "https://via.placeholder.com/48"} alt=""
                          style={{ width: 44, height: 34, objectFit: "cover", borderRadius: 6, background: "#1a1a1a" }} />
                        <span style={{ color: "#f0f0f0", fontSize: 14, fontWeight: 500 }}>{product.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{ background: "rgba(230,57,70,0.1)", color: "#e63946", padding: "3px 10px", borderRadius: 20, fontSize: 11, textTransform: "capitalize" }}>{product.category}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#e63946", fontWeight: 700 }}>₹{product.finalPrice?.toFixed(0)}</td>
                    <td style={{ padding: "12px 16px", color: product.stock === 0 ? "#e63946" : "#4caf50", fontWeight: 600 }}>{product.stock}</td>
                    <td style={{ padding: "12px 16px", color: "#aaa" }}>{product.totalSales}</td>
                    <td style={{ padding: "12px 16px", color: "#f4a261" }}>★ {product.ratings?.toFixed(1)}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => navigate(`/seller/product/edit/${product._id}`)}
                          style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#f0f0f0", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Edit</button>
                        <button onClick={() => handleDelete(product._id)}
                          style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)", color: "#e63946", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
