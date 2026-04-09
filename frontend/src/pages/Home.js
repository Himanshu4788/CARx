import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/product/ProductCard";

const CATEGORIES = [
  { name: "Sports", icon: "🏎️", value: "sports" },
  { name: "Trucks", icon: "🚛", value: "trucks" },
  { name: "Vintage", icon: "🚗", value: "vintage" },
  { name: "Electric", icon: "⚡", value: "electric" },
  { name: "Military", icon: "🪖", value: "military" },
  { name: "Premium ", icon: "💎", value: "Premium " },
  {name : "Arrival", icon: "🆕", value: "Arrival"},
  { name: "Other", icon: "🎮", value: "Other" },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [], loading } = useSelector((s) => s.products || {});

  useEffect(() => {
    dispatch(fetchProducts({ sort: "popular", limit: 8 }));
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: "88vh", display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #0a0a0a 0%, #100a0a 50%, #0a0a0a 100%)",
        position: "relative", overflow: "hidden", padding: "60px 20px"
      }}>
        {/* Background accent */}
        <div style={{ position: "absolute", top: "10%", right: "5%", width: 500, height: 500, background: "radial-gradient(circle, rgba(230,57,70,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "10%", left: "5%", width: 300, height: 300, background: "radial-gradient(circle, rgba(230,57,70,0.05) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center", width: "100%" }}>
          <div className="fade-in">
            <div style={{ display: "inline-block", background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)", color: "#e63946", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, letterSpacing: 1, marginBottom: 20 }}>
              🚗 INDIA'S #1 TOY CAR MARKETPLACE
            </div>
            <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: "clamp(60px, 8vw, 110px)", lineHeight: 0.9, marginBottom: 24, color: "#f0f0f0" }}>
              COLLECT<br />
              <span style={{ color: "#e63946" }}>RACE</span><br />
              DOMINATE
            </h1>
            <p style={{ color: "#888", fontSize: 17, lineHeight: 1.7, marginBottom: 32, maxWidth: 420 }}>
              Buy and sell premium toy cars from trusted sellers across India. Sports, vintage, electric — find your next obsession.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link to="/products"><button className="btn-primary" style={{ padding: "13px 32px", fontSize: 15 }}>Shop Now →</button></Link>
              <Link to="/register"><button className="btn-outline" style={{ padding: "13px 32px", fontSize: 15 }}>Sell Your Cars</button></Link>
            </div>
            <div style={{ display: "flex", gap: 32, marginTop: 40 }}>
              {[["10K+", "Listings"], ["5K+", "Sellers"], ["50K+", "Orders"]].map(([num, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, color: "#e63946" }}>{num}</div>
                  <div style={{ color: "#666", fontSize: 12 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16, opacity: 0.9 }}>
            <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: 80 }}>🏎️</div>
              <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 24, color: "#f0f0f0", marginTop: 8 }}>SPORTS COLLECTION</div>
              <div style={{ color: "#888", fontSize: 13 }}>Starting at ₹299</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 40 }}>🚗</div>
                <div style={{ color: "#f0f0f0", fontSize: 13, fontWeight: 600, marginTop: 4 }}>Vintage</div>
              </div>
              <div style={{ background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.3)", borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 40 }}>⚡</div>
                <div style={{ color: "#e63946", fontSize: 13, fontWeight: 600, marginTop: 4 }}>Electric</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: "60px 20px", background: "#0d0d0d" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, color: "#f0f0f0", marginBottom: 8 }}>SHOP BY CATEGORY</h2>
          <p style={{ color: "#666", marginBottom: 32 }}>Explore our wide range of toy car collections</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12 }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.value} onClick={() => navigate(`/products?category=${cat.value}`)}
                className="glass-card card-hover"
                style={{ padding: "20px 12px", textAlign: "center", border: "1px solid #2a2a2a", borderRadius: 12, cursor: "pointer", background: "#141414", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#e63946"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{cat.icon}</div>
                <div style={{ color: "#f0f0f0", fontSize: 13, fontWeight: 600, textTransform: "capitalize" }}>{cat.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: "60px 20px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
            <div>
              <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, color: "#f0f0f0" }}>POPULAR PICKS</h2>
              <p style={{ color: "#666" }}>Most loved by our community</p>
            </div>
            <Link to="/products" style={{ color: "#e63946", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>View All →</Link>
          </div>
          {loading ? (
            <div style={{ textAlign: "center", padding: 60, color: "#666" }}>Loading products...</div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
              {products?.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* Sell CTA */}
      <section style={{ padding: "60px 20px", background: "linear-gradient(135deg, #e63946 0%, #c1121f 100%)" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, color: "white", marginBottom: 12 }}>START SELLING TODAY</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 16, marginBottom: 28 }}>
            Join thousands of sellers making money from their toy car collections
          </p>
          <Link to="/register">
            <button style={{ background: "white", color: "#e63946", border: "none", padding: "14px 36px", borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "'Outfit', sans-serif" }}>
              Create Seller Account →
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
