import React from "react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer style={{ background: "#0d0d0d", borderTop: "1px solid #1e1e1e", padding: "40px 20px 24px" }}>
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 32 }}>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 28, marginBottom: 8 }}>
            <span style={{ color: "#e63946" }}>CAR</span><span style={{ color: "#f0f0f0" }}>X</span>
          </div>
          <p style={{ color: "#666", fontSize: 13, lineHeight: 1.6 }}>India's premier toy car marketplace. Buy, sell, collect.</p>
        </div>
        <div>
          <h4 style={{ color: "#f0f0f0", marginBottom: 12, fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>SHOP</h4>
          {[["Browse All", "/products"], ["Sports Cars", "/products?category=sports"], ["Vintage", "/products?category=vintage"], ["Trucks", "/products?category=trucks"]].map(([label, to]) => (
            <Link key={to} to={to} style={{ display: "block", color: "#666", textDecoration: "none", fontSize: 13, marginBottom: 6 }}>{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: "#f0f0f0", marginBottom: 12, fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>ACCOUNT</h4>
          {[["My Orders", "/orders"], ["Wishlist", "/wishlist"], ["Profile", "/profile"], ["Seller Dashboard", "/seller/dashboard"]].map(([label, to]) => (
            <Link key={to} to={to} style={{ display: "block", color: "#666", textDecoration: "none", fontSize: 13, marginBottom: 6 }}>{label}</Link>
          ))}
        </div>
        <div>
          <h4 style={{ color: "#f0f0f0", marginBottom: 12, fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>CONTACT</h4>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 6 }}>support@carx.in</p>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 6 }}>New Delhi, India</p>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            {["𝕏", "📘", "📸"].map((icon, i) => (
              <span key={i} style={{ width: 32, height: 32, background: "#1e1e1e", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14 }}>{icon}</span>
            ))}
          </div>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #1e1e1e", paddingTop: 20, textAlign: "center", color: "#444", fontSize: 12 }}>
        © {new Date().getFullYear()} CarX. Built with ❤️ in India.
      </div>
    </div>
  </footer>
);

export default Footer;
