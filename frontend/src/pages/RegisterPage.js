import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, clearError } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "buyer" });

  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register(form));
  };

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: 420, padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 36 }}>
            <span style={{ color: "#e63946" }}>CAR</span><span style={{ color: "#f0f0f0" }}>X</span>
          </div>
          <h2 style={{ color: "#f0f0f0", fontSize: 22, fontWeight: 600, marginTop: 8 }}>Create Account</h2>
          <p style={{ color: "#666", fontSize: 14 }}>Join the CarX community</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>FULL NAME</label>
            <input className="input-field" placeholder="John Doe" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>EMAIL</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input className="input-field" type="password" placeholder="Min. 6 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 8 }}>I WANT TO</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[["buyer", "🛒 Buy Cars"], ["seller", "🏪 Sell Cars"]].map(([val, label]) => (
                <button key={val} type="button" onClick={() => setForm({ ...form, role: val })}
                  style={{ padding: "12px 8px", border: `2px solid ${form.role === val ? "#e63946" : "#2a2a2a"}`, borderRadius: 8, background: form.role === val ? "rgba(230,57,70,0.1)" : "transparent", color: form.role === val ? "#e63946" : "#888", cursor: "pointer", fontSize: 14, fontWeight: 600, transition: "all 0.2s" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: 13, fontSize: 15, marginTop: 8 }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p style={{ textAlign: "center", color: "#666", fontSize: 14, marginTop: 20 }}>
          Already have an account? <Link to="/login" style={{ color: "#e63946", textDecoration: "none", fontWeight: 600 }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
