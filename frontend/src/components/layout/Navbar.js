import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  const { items } = useSelector((s) => s.cart);
  const { products: wishItems } = useSelector((s) => s.wishlist);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("See you soon! 👋");
    navigate("/");
    setMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  const cartCount = items?.length || 0;
  const wishCount = wishItems?.length || 0;

  return (
    <>
      <nav style={{
        background: scrolled ? "rgba(10,10,10,0.95)" : "#0a0a0a",
        borderBottom: `1px solid ${scrolled ? "#1e1e1e" : "transparent"}`,
        position: "sticky", top: 0, zIndex: 1000,
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "all 0.3s ease",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none"
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 2 }}>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 34, color: "#e63946", letterSpacing: 3 }}>CAR</span>
            <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 34, color: "#f0f0f0", letterSpacing: 3 }}>X</span>
            <span style={{ fontSize: 9, background: "#e63946", color: "white", padding: "2px 7px", borderRadius: 4, fontWeight: 800, marginLeft: 6, letterSpacing: 1 }}>MARKETPLACE</span>
          </Link>

          {/* Center Nav Links */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {[
              { label: "Browse", to: "/products" },
              ...(isAuthenticated && user?.role !== "buyer" ? [{ label: "Dashboard", to: "/seller/dashboard" }] : []),
            ].map((item) => (
              <Link key={item.to} to={item.to} style={{ textDecoration: "none" }}>
                <div style={{
                  color: location.pathname === item.to ? "#e63946" : "#888",
                  fontSize: 14, fontWeight: 600, padding: "6px 14px", borderRadius: 8,
                  transition: "all 0.2s", position: "relative",
                  background: location.pathname === item.to ? "rgba(230,57,70,0.08)" : "transparent"
                }}
                  onMouseEnter={e => { if (location.pathname !== item.to) { e.currentTarget.style.color = "#f0f0f0"; e.currentTarget.style.background = "#141414"; } }}
                  onMouseLeave={e => { if (location.pathname !== item.to) { e.currentTarget.style.color = "#888"; e.currentTarget.style.background = "transparent"; } }}>
                  {item.label}
                </div>
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>

            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: 18, padding: "8px", borderRadius: 8, transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center" }}
              onMouseEnter={e => { e.currentTarget.style.color = "#f0f0f0"; e.currentTarget.style.background = "#141414"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.background = "transparent"; }}>
              🔍
            </button>

            {isAuthenticated && (
              <>
                {/* Wishlist */}
                <Link to="/wishlist" style={{ textDecoration: "none", position: "relative", display: "flex" }}>
                  <button style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: 18, padding: "8px", borderRadius: 8, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#e63946"; e.currentTarget.style.background = "#141414"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.background = "transparent"; }}>
                    🤍
                  </button>
                  {wishCount > 0 && (
                    <span style={{ position: "absolute", top: 2, right: 2, background: "#e63946", color: "white", fontSize: 9, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>
                      {wishCount}
                    </span>
                  )}
                </Link>

                {/* Cart */}
                <Link to="/cart" style={{ textDecoration: "none", position: "relative", display: "flex" }}>
                  <button style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer", fontSize: 18, padding: "8px", borderRadius: 8, transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.color = "#e63946"; e.currentTarget.style.background = "#141414"; }}
                    onMouseLeave={e => { e.currentTarget.style.color = "#888"; e.currentTarget.style.background = "transparent"; }}>
                    🛒
                  </button>
                  {cartCount > 0 && (
                    <span style={{ position: "absolute", top: 2, right: 2, background: "#e63946", color: "white", fontSize: 9, borderRadius: "50%", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, animation: "pulse 2s infinite" }}>
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            )}

            {/* User Menu */}
            {isAuthenticated ? (
              <div style={{ position: "relative" }}>
                <button onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    background: menuOpen ? "#e63946" : "#1a1a1a",
                    border: `1px solid ${menuOpen ? "#e63946" : "#2a2a2a"}`,
                    color: "white", padding: "7px 14px", borderRadius: 10,
                    cursor: "pointer", fontSize: 13, fontWeight: 600,
                    display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s",
                    fontFamily: "'Outfit', sans-serif"
                  }}>
                  <div style={{ width: 26, height: 26, background: menuOpen ? "rgba(255,255,255,0.2)" : "#e63946", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13 }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  {user?.name?.split(" ")[0]}
                  <span style={{ fontSize: 10, opacity: 0.7, transform: menuOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}>▼</span>
                </button>

                {menuOpen && (
                  <div style={{
                    position: "absolute", right: 0, top: 52,
                    background: "#141414", border: "1px solid #2a2a2a",
                    borderRadius: 14, width: 200, zIndex: 300,
                    overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
                    animation: "dropDown 0.2s ease"
                  }}>
                    {/* User info header */}
                    <div style={{ padding: "14px 16px", borderBottom: "1px solid #1e1e1e", background: "#0d0d0d" }}>
                      <div style={{ color: "#f0f0f0", fontWeight: 700, fontSize: 14 }}>{user?.name}</div>
                      <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{user?.email}</div>
                      <span style={{ background: "rgba(230,57,70,0.1)", color: "#e63946", padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700, display: "inline-block", marginTop: 4, textTransform: "uppercase" }}>
                        {user?.role}
                      </span>
                    </div>

                    {[
                      { label: "👤  My Profile", to: "/profile" },
                      { label: "📦  My Orders", to: "/orders" },
                      { label: "🤍  Wishlist", to: "/wishlist" },
                      ...(user?.role !== "buyer" ? [{ label: "📊  Seller Dashboard", to: "/seller/dashboard" }] : []),
                    ].map((item) => (
                      <Link key={item.to} to={item.to} onClick={() => setMenuOpen(false)}
                        style={{ display: "block", padding: "11px 16px", color: "#aaa", textDecoration: "none", fontSize: 13, borderBottom: "1px solid #1a1a1a", transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "#1a1a1a"; e.currentTarget.style.color = "#f0f0f0"; e.currentTarget.style.paddingLeft = "20px"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#aaa"; e.currentTarget.style.paddingLeft = "16px"; }}>
                        {item.label}
                      </Link>
                    ))}

                    <button onClick={handleLogout}
                      style={{ width: "100%", textAlign: "left", padding: "11px 16px", background: "transparent", border: "none", color: "#e63946", cursor: "pointer", fontSize: 13, fontFamily: "'Outfit', sans-serif", transition: "all 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(230,57,70,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      🚪  Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <Link to="/login">
                  <button style={{ background: "transparent", border: "1px solid #2a2a2a", color: "#aaa", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "'Outfit', sans-serif", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.color = "#f0f0f0"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#2a2a2a"; e.currentTarget.style.color = "#aaa"; }}>
                    Login
                  </button>
                </Link>
                <Link to="/register">
                  <button style={{ background: "#e63946", border: "none", color: "white", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "'Outfit', sans-serif", boxShadow: "0 4px 14px rgba(230,57,70,0.3)", transition: "all 0.2s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#c1121f"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#e63946"; e.currentTarget.style.transform = "translateY(0)"; }}>
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search Bar Dropdown */}
      {searchOpen && (
        <div style={{ position: "fixed", top: 68, left: 0, right: 0, zIndex: 999, background: "rgba(10,10,10,0.98)", borderBottom: "1px solid #2a2a2a", padding: "16px 20px", backdropFilter: "blur(20px)" }}>
          <form onSubmit={handleSearch} style={{ maxWidth: 600, margin: "0 auto", display: "flex", gap: 10 }}>
            <input
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for toy cars... (e.g. Hot Wheels, Ferrari)"
              className="input-field"
              style={{ flex: 1, fontSize: 15, padding: "12px 16px" }}
            />
            <button type="submit" className="btn-primary" style={{ padding: "12px 24px", fontSize: 14 }}>Search</button>
            <button type="button" onClick={() => setSearchOpen(false)}
              style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", color: "#888", padding: "12px 16px", borderRadius: 8, cursor: "pointer", fontSize: 16 }}>✕</button>
          </form>
        </div>
      )}

      {/* Backdrop */}
      {(menuOpen || searchOpen) && (
        <div style={{ position: "fixed", inset: 0, zIndex: 998 }} onClick={() => { setMenuOpen(false); setSearchOpen(false); }} />
      )}

      <style>{`
        @keyframes dropDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.15); } }
      `}</style>
    </>
  );
};

export default Navbar;