// LoginPage.js
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../redux/slices/authSlice";
import toast from "react-hot-toast";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading, error } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => { if (isAuthenticated) navigate("/"); }, [isAuthenticated, navigate]);
  useEffect(() => { if (error) { toast.error(error); dispatch(clearError()); } }, [error, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div style={{ minHeight: "calc(100vh - 140px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div className="glass-card" style={{ width: "100%", maxWidth: 400, padding: 36 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 36 }}>
            <span style={{ color: "#e63946" }}>CAR</span><span style={{ color: "#f0f0f0" }}>X</span>
          </div>
          <h2 style={{ color: "#f0f0f0", fontSize: 22, fontWeight: 600, marginTop: 8 }}>Welcome Back</h2>
          <p style={{ color: "#666", fontSize: 14 }}>Login to your account</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>EMAIL</label>
            <input className="input-field" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>PASSWORD</label>
            <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ padding: 13, fontSize: 15, marginTop: 8 }}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p style={{ textAlign: "center", color: "#666", fontSize: 14, marginTop: 20 }}>
          Don't have an account? <Link to="/register" style={{ color: "#e63946", textDecoration: "none", fontWeight: 600 }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
