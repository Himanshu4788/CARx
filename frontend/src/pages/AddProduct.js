import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, updateProduct, fetchProduct } from "../redux/slices/productSlice";
import toast from "react-hot-toast";

const CATEGORIES = ["sports", "trucks", "vintage", "electric", "military", "luxury", "bikes", "other"];

const ProductForm = ({ isEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { product, loading } = useSelector((s) => s.products);

  const [form, setForm] = useState({
    name: "", description: "", price: "", discountPercent: 0, category: "sports", stock: ""
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && id) dispatch(fetchProduct(id));
  }, [isEdit, id, dispatch]);

  useEffect(() => {
    if (isEdit && product && product._id === id) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price,
        discountPercent: product.discountPercent,
        category: product.category,
        stock: product.stock,
      });
      if (product.images?.length) {
        setPreviews(product.images.map((img) => img.url));
      }
    }
  }, [product, isEdit, id]);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) return toast.error("Please fill all required fields");

    setSubmitting(true);
    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    images.forEach((img) => formData.append("images", img));

    try {
      if (isEdit) {
        await dispatch(updateProduct({ id, formData })).unwrap();
        toast.success("Product updated!");
      } else {
        await dispatch(createProduct(formData)).unwrap();
        toast.success("Product created!");
      }
      navigate("/seller/dashboard");
    } catch (err) {
      toast.error(err || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 48, color: "#f0f0f0", marginBottom: 32 }}>
        {isEdit ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="glass-card" style={{ padding: 28, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Name */}
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>PRODUCT NAME *</label>
            <input className="input-field" placeholder="e.g. Hot Wheels Ferrari 488" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>

          {/* Description */}
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>DESCRIPTION *</label>
            <textarea className="input-field" rows={4} placeholder="Describe the toy car..."
              value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              style={{ resize: "vertical" }} required />
          </div>

          {/* Price + Discount */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>PRICE (₹) *</label>
              <input className="input-field" type="number" min="0" placeholder="499" value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })} required />
            </div>
            <div>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>DISCOUNT (%)</label>
              <input className="input-field" type="number" min="0" max="100" value={form.discountPercent}
                onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} />
            </div>
          </div>

          {/* Category + Stock */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>CATEGORY *</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>STOCK *</label>
              <input className="input-field" type="number" min="0" placeholder="10" value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
            </div>
          </div>

          {/* Final price preview */}
          {form.price && (
            <div style={{ background: "#0d0d0d", padding: 12, borderRadius: 8, fontSize: 13, color: "#888" }}>
              Final price: <span style={{ color: "#e63946", fontWeight: 700, fontSize: 16 }}>
                ₹{(form.price - (form.price * form.discountPercent) / 100).toFixed(0)}
              </span>
              {form.discountPercent > 0 && <span style={{ marginLeft: 8 }}>({form.discountPercent}% off ₹{form.price})</span>}
            </div>
          )}

          {/* Images */}
          <div>
            <label style={{ color: "#888", fontSize: 12, fontWeight: 600, letterSpacing: 1, display: "block", marginBottom: 6 }}>
              PRODUCT IMAGES {!isEdit && "*"}
            </label>
            <input type="file" accept="image/*" multiple onChange={handleImages}
              style={{ color: "#aaa", fontSize: 14, cursor: "pointer" }} />
            {previews.length > 0 && (
              <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
                {previews.map((src, i) => (
                  <img key={i} src={src} alt="" style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8, border: "2px solid #2a2a2a" }} />
                ))}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button type="submit" className="btn-primary" disabled={submitting} style={{ flex: 1, padding: 14, fontSize: 15 }}>
              {submitting ? "Saving..." : isEdit ? "Update Product" : "Create Product"}
            </button>
            <button type="button" className="btn-outline" onClick={() => navigate("/seller/dashboard")} style={{ padding: "14px 24px" }}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export const AddProduct = () => <ProductForm isEdit={false} />;
export const EditProduct = () => <ProductForm isEdit={true} />;

export default AddProduct;
