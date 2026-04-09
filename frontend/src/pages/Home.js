import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import ProductCard from "../components/product/ProductCard";

const CATEGORIES = [
  { name: "Sports", icon: "🏎️", value: "sports", color: "#e63946" },
  { name: "Trucks", icon: "🚛", value: "trucks", color: "#4fc3f7" },
  { name: "Vintage", icon: "🚗", value: "vintage", color: "#f4a261" },
  { name: "Electric", icon: "⚡", value: "electric", color: "#4caf50" },
  { name: "Military", icon: "🪖", value: "military", color: "#8d6e63" },
  { name: "Luxury", icon: "💎", value: "luxury", color: "#ce93d8" },
  { name: "Bikes", icon: "🏍️", value: "bikes", color: "#ff7043" },
  { name: "Other", icon: "🎮", value: "other", color: "#90a4ae" },
];

const StatCard = ({ value, label, icon }) => (
  <div style={{ textAlign: "center" }}>
    <div style={{ fontSize: 28, marginBottom: 4 }}>{icon}</div>
    <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 42, color: "#e63946", lineHeight: 1 }}>{value}</div>
    <div style={{ color: "#666", fontSize: 13, marginTop: 4, letterSpacing: 1 }}>{label}</div>
  </div>
);

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, loading } = useSelector((s) => s.products);
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => { dispatch(fetchProducts({ sort: "popular", limit: 8 })); }, [dispatch]);

  return (
    <div style={{ overflowX: "hidden" }}>

      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section style={{
        minHeight: "92vh", display: "flex", alignItems: "center",
        background: "#0a0a0a", position: "relative", overflow: "hidden", padding: "80px 20px 60px"
      }}>
        {/* Animated background grid */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.03,
          backgroundImage: "linear-gradient(#e63946 1px, transparent 1px), linear-gradient(90deg, #e63946 1px, transparent 1px)",
          backgroundSize: "60px 60px"
        }} />

        {/* Red glow blobs */}
        <div style={{ position: "absolute", top: "15%", right: "10%", width: 600, height: 600, background: "radial-gradient(circle, rgba(230,57,70,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "5%", left: "-5%", width: 400, height: 400, background: "radial-gradient(circle, rgba(230,57,70,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }}>
          {/* Left */}
          <div style={{ animation: "fadeInUp 0.8s ease" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(230,57,70,0.08)", border: "1px solid rgba(230,57,70,0.25)",
              color: "#e63946", padding: "6px 16px", borderRadius: 30,
              fontSize: 12, fontWeight: 700, letterSpacing: 2, marginBottom: 24
            }}>
              <span style={{ width: 6, height: 6, background: "#e63946", borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
              INDIA'S #1 TOY CAR MARKETPLACE
            </div>

            <h1 style={{
              fontFamily: "'Bebas Neue', cursive",
              fontSize: "clamp(70px, 9vw, 120px)",
              lineHeight: 0.88, marginBottom: 28, color: "#f0f0f0",
              letterSpacing: 2
            }}>
              COLLECT<br />
              <span style={{
                color: "transparent",
                WebkitTextStroke: "2px #e63946",
                display: "block"
              }}>RACE</span>
              DOMINATE
            </h1>

            <p style={{ color: "#777", fontSize: 17, lineHeight: 1.8, marginBottom: 36, maxWidth: 440 }}>
              Buy and sell premium toy cars from trusted sellers across India.
              Sports, vintage, electric — find your next obsession.
            </p>

            <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
              <Link to="/products">
                <button style={{
                  background: "#e63946", color: "white", border: "none",
                  padding: "15px 36px", borderRadius: 10, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Outfit', sans-serif", letterSpacing: 0.5,
                  boxShadow: "0 8px 32px rgba(230,57,70,0.35)", transition: "all 0.2s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(230,57,70,0.5)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(230,57,70,0.35)"; }}>
                  Shop Now →
                </button>
              </Link>
              <Link to="/register">
                <button style={{
                  background: "transparent", color: "#f0f0f0",
                  border: "1.5px solid #333", padding: "15px 36px",
                  borderRadius: 10, fontSize: 15, fontWeight: 700,
                  cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.2s"
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#e63946"; e.currentTarget.style.color = "#e63946"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#333"; e.currentTarget.style.color = "#f0f0f0"; }}>
                  Start Selling
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", gap: 40, paddingTop: 32, borderTop: "1px solid #1e1e1e" }}>
              {[["10K+", "Listings", "📦"], ["5K+", "Sellers", "🏪"], ["50K+", "Happy Buyers", "😊"]].map(([val, label, icon]) => (
                <StatCard key={label} value={val} label={label} icon={icon} />
              ))}
            </div>
          </div>

          {/* Right — Visual Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, animation: "fadeInUp 1s ease" }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <div style={{
                background: "linear-gradient(135deg, #1a0a0b, #2a0e10)",
                border: "1px solid rgba(230,57,70,0.3)",
                borderRadius: 20, padding: 28, textAlign: "center",
                boxShadow: "0 20px 60px rgba(230,57,70,0.1)"
              }}>
                <div style={{ fontSize: 72, marginBottom: 8 }}>🏎️</div>
                <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: "#f0f0f0", letterSpacing: 2 }}>SPORTS COLLECTION</div>
                <div style={{ color: "#e63946", fontSize: 13, fontWeight: 600, marginTop: 4 }}>Starting at ₹299</div>
                <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
                  {["🔴", "🔵", "⚫", "⚪"].map((c, i) => (
                    <span key={i} style={{ fontSize: 8 }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>

            {[
              { icon: "🚗", label: "Vintage", color: "#f4a261", bg: "#1a1209" },
              { icon: "⚡", label: "Electric", color: "#4caf50", bg: "#091a0e" },
              { icon: "🚛", label: "Trucks", color: "#4fc3f7", bg: "#091219" },
              { icon: "💎", label: "Luxury", color: "#ce93d8", bg: "#130919" },
            ].map((item) => (
              <button key={item.label} onClick={() => navigate(`/products?category=${item.label.toLowerCase()}`)}
                style={{
                  background: item.bg, border: `1px solid ${item.color}33`,
                  borderRadius: 16, padding: "20px 16px", textAlign: "center",
                  cursor: "pointer", transition: "all 0.2s"
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; e.currentTarget.style.borderColor = item.color; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.borderColor = `${item.color}33`; }}>
                <div style={{ fontSize: 36, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ color: item.color, fontSize: 13, fontWeight: 700 }}>{item.label}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MARQUEE BANNER ──────────────────────────────────── */}
      <div style={{ background: "#e63946", padding: "12px 0", overflow: "hidden", whiteSpace: "nowrap" }}>
        <div style={{ display: "inline-block", animation: "marquee 20s linear infinite" }}>
          {Array(4).fill("🚗 FREE SHIPPING ABOVE ₹999  •  🔥 NEW ARRIVALS DAILY  •  ⭐ 10,000+ HAPPY CUSTOMERS  •  🔒 SECURE PAYMENTS  •  ").map((text, i) => (
            <span key={i} style={{ color: "white", fontSize: 13, fontWeight: 700, letterSpacing: 1, marginRight: 40 }}>{text}</span>
          ))}
        </div>
        <style>{`
          @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        `}</style>
      </div>

      {/* ─── CATEGORIES ──────────────────────────────────────── */}
      <section style={{ padding: "80px 20px", background: "#0d0d0d" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ color: "#e63946", fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>EXPLORE</div>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, color: "#f0f0f0", marginBottom: 8 }}>SHOP BY CATEGORY</h2>
            <p style={{ color: "#555", fontSize: 15 }}>Find the perfect toy car that matches your style</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 14 }}>
            {CATEGORIES.map((cat) => (
              <button key={cat.value}
                onClick={() => { setActiveCategory(cat.value); navigate(`/products?category=${cat.value}`); }}
                style={{
                  padding: "24px 16px", textAlign: "center",
                  background: activeCategory === cat.value ? `${cat.color}15` : "#141414",
                  border: `1px solid ${activeCategory === cat.value ? cat.color : "#2a2a2a"}`,
                  borderRadius: 16, cursor: "pointer", transition: "all 0.25s",
                  position: "relative", overflow: "hidden"
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color; e.currentTarget.style.background = `${cat.color}12`; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => {
                  if (activeCategory !== cat.value) {
                    e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.background = "#141414";
                  }
                  e.currentTarget.style.transform = "translateY(0)";
                }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{cat.icon}</div>
                <div style={{ color: "#f0f0f0", fontSize: 13, fontWeight: 600 }}>{cat.name}</div>
                <div style={{ width: 24, height: 2, background: cat.color, borderRadius: 2, margin: "8px auto 0" }} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ───────────────────────────────── */}
      <section style={{ padding: "80px 20px", background: "#0a0a0a" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
            <div>
              <div style={{ color: "#e63946", fontSize: 12, fontWeight: 700, letterSpacing: 3, marginBottom: 8 }}>TRENDING NOW</div>
              <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, color: "#f0f0f0", marginBottom: 4 }}>POPULAR PICKS</h2>
              <p style={{ color: "#555" }}>Most loved by our community this week</p>
            </div>
            <Link to="/products" style={{ textDecoration: "none" }}>
              <button style={{ background: "transparent", border: "1.5px solid #e63946", color: "#e63946", padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "'Outfit', sans-serif", transition: "all 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.background = "#e63946"; e.currentTarget.style.color = "white"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#e63946"; }}>
                View All →
              </button>
            </Link>
          </div>

          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ background: "#141414", borderRadius: 16, height: 340, overflow: "hidden", border: "1px solid #2a2a2a" }}>
                  <div style={{ height: "55%", background: "linear-gradient(90deg, #1a1a1a, #222, #1a1a1a)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }} />
                  <div style={{ padding: 16 }}>
                    <div style={{ height: 12, background: "#1e1e1e", borderRadius: 4, marginBottom: 8, width: "80%" }} />
                    <div style={{ height: 10, background: "#1e1e1e", borderRadius: 4, width: "50%" }} />
                  </div>
                  <style>{`@keyframes shimmer { to { background-position: -200% 0; } }`}</style>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
              {(products || []).map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          )}
        </div>
      </section>

      {/* ─── WHY CARX ─────────────────────────────────────────── */}
      <section style={{ padding: "80px 20px", background: "#0d0d0d" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, color: "#f0f0f0", marginBottom: 8 }}>WHY CHOOSE CARX?</h2>
            <p style={{ color: "#555" }}>Everything you need for the perfect toy car experience</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { icon: "🔒", title: "Secure Payments", desc: "100% safe transactions via Razorpay with bank-level security", color: "#4caf50" },
              { icon: "🚚", title: "Fast Delivery", desc: "Quick shipping across India with real-time order tracking", color: "#4fc3f7" },
              { icon: "↩️", title: "Easy Returns", desc: "7-day hassle-free return policy on all purchases", color: "#f4a261" },
              { icon: "⭐", title: "Verified Sellers", desc: "All sellers are verified with authentic product listings", color: "#ce93d8" },
            ].map((item) => (
              <div key={item.title}
                style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16, padding: 28, transition: "all 0.25s", cursor: "default" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = item.color; e.currentTarget.style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.transform = "translateY(0)"; }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ color: item.color, fontSize: 18, fontWeight: 700, marginBottom: 8, fontFamily: "'Outfit', sans-serif" }}>{item.title}</h3>
                <p style={{ color: "#666", fontSize: 14, lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SELL CTA ─────────────────────────────────────────── */}
      <section style={{ padding: "80px 20px", background: "#0a0a0a", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(135deg, #e63946 0%, #c1121f 100%)", opacity: 0.95 }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: 400, background: "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)" }} />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 60, marginBottom: 16 }}>🏪</div>
          <h2 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 60, color: "white", marginBottom: 12, lineHeight: 1 }}>
            START SELLING TODAY
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 17, marginBottom: 32, lineHeight: 1.7 }}>
            Join 5,000+ sellers making money from their toy car collections. List your first product in minutes!
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register">
              <button style={{ background: "white", color: "#e63946", border: "none", padding: "16px 40px", borderRadius: 10, fontWeight: 800, fontSize: 16, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: "0 8px 30px rgba(0,0,0,0.2)", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                Create Seller Account →
              </button>
            </Link>
            <Link to="/products">
              <button style={{ background: "transparent", color: "white", border: "2px solid rgba(255,255,255,0.5)", padding: "16px 40px", borderRadius: 10, fontWeight: 700, fontSize: 16, cursor: "pointer", fontFamily: "'Outfit', sans-serif", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "white"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)"}>
                Browse First
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;