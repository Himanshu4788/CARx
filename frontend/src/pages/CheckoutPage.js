import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../redux/slices/cartSlice";
import { createOrder } from "../redux/slices/orderSlice";
import axios from "axios";
import toast from "react-hot-toast";

// Load Razorpay script dynamically
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, total } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("address"); // address | review

  const [address, setAddress] = useState({
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
    country: "India",
  });

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);

  const shipping = total >= 999 ? 0 : 79;
  const grandTotal = total + shipping;

  const validateAddress = () => {
    if (!address.street.trim()) { toast.error("Please enter street address"); return false; }
    if (!address.city.trim()) { toast.error("Please enter city"); return false; }
    if (!address.state.trim()) { toast.error("Please enter state"); return false; }
    if (!address.pincode.trim() || address.pincode.length < 6) { toast.error("Please enter valid 6-digit pincode"); return false; }
    return true;
  };

  const handlePayment = async () => {
    if (!validateAddress()) return;
    setLoading(true);

    try {
      // Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay. Check your internet connection.");
        setLoading(false);
        return;
      }

      // Create order on backend
      const { data } = await axios.post(
        "/api/v1/payment/order",
        { amount: grandTotal },
        { withCredentials: true }
      );

      if (!data.success) {
        toast.error(data.message || "Failed to create payment order");
        setLoading(false);
        return;
      }

      // Razorpay options
      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: "INR",
        name: "CarX Marketplace",
        description: `${items.length} toy car(s)`,
        image: "https://via.placeholder.com/150?text=CarX",
        order_id: data.order.id,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await axios.post("/api/v1/payment/verify", response, { withCredentials: true });

            if (!verifyRes.data.success) {
              toast.error("Payment verification failed!");
              return;
            }

            // Create order in DB
            const orderItems = items.map(({ product, quantity }) => ({
              product: product._id,
              name: product.name,
              image: product.images?.[0]?.url || "",
              price: product.finalPrice,
              quantity,
            }));

            const orderResult = await dispatch(createOrder({
              orderItems,
              shippingAddress: address,
              paymentInfo: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                status: "paid",
              },
              itemsPrice: total,
              shippingPrice: shipping,
              totalPrice: grandTotal,
            }));

            if (orderResult.error) {
              toast.error("Order creation failed. Contact support.");
              return;
            }

            toast.success("Payment successful! 🎉");
            navigate("/order/success");
          } catch (err) {
            toast.error("Something went wrong after payment. Contact support.");
            console.error(err);
          }
        },
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: "",
        },
        notes: {
          address: `${address.street}, ${address.city}`,
        },
        theme: { color: "#e63946" },
        modal: {
          ondismiss: () => {
            toast("Payment cancelled", { icon: "ℹ️" });
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
      });
      rzp.open();
    } catch (err) {
      console.error("Payment error:", err);
      const msg = err.response?.data?.message || "Failed to initiate payment";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 52, color: "#f0f0f0", marginBottom: 8 }}>CHECKOUT</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>You're almost there! Complete your order below.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 28 }}>

        {/* Left — Address Form */}
        <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16, padding: 28 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 26, color: "#f0f0f0", marginBottom: 4 }}>DELIVERY ADDRESS</h3>
          <p style={{ color: "#555", fontSize: 13, marginBottom: 24 }}>Where should we deliver your toy cars?</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, display: "block", marginBottom: 8 }}>STREET ADDRESS *</label>
              <input className="input-field" placeholder="House no., Street, Area, Landmark"
                value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, display: "block", marginBottom: 8 }}>CITY *</label>
                <input className="input-field" placeholder="City"
                  value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} />
              </div>
              <div>
                <label style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, display: "block", marginBottom: 8 }}>STATE *</label>
                <input className="input-field" placeholder="State"
                  value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, display: "block", marginBottom: 8 }}>PINCODE *</label>
                <input className="input-field" placeholder="6-digit pincode" maxLength={6}
                  value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, "") })} />
              </div>
              <div>
                <label style={{ color: "#888", fontSize: 11, fontWeight: 700, letterSpacing: 1.5, display: "block", marginBottom: 8 }}>COUNTRY</label>
                <input className="input-field" value="India" disabled style={{ opacity: 0.5 }} />
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div style={{ display: "flex", gap: 20, marginTop: 24, paddingTop: 20, borderTop: "1px solid #1e1e1e" }}>
            {[["🔒", "SSL Secured"], ["📦", "Insured Delivery"], ["↩️", "7-Day Returns"]].map(([icon, text]) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, color: "#555", fontSize: 12 }}>
                <span>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Order Summary + Pay */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Order Summary */}
          <div style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(135deg, #e63946, #c1121f)", padding: "16px 20px" }}>
              <h3 style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 22, color: "white", margin: 0 }}>ORDER SUMMARY</h3>
            </div>
            <div style={{ padding: 20 }}>
              {/* Items */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {items.map(({ product, quantity }) => product && (
                  <div key={product._id} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <img src={product.images?.[0]?.url || "https://via.placeholder.com/48"}
                      alt={product.name}
                      style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 8, background: "#1a1a1a", border: "1px solid #2a2a2a" }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "#f0f0f0", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {product.name}
                      </div>
                      <div style={{ color: "#666", fontSize: 11 }}>Qty: {quantity}</div>
                    </div>
                    <div style={{ color: "#e63946", fontWeight: 700, fontSize: 14 }}>
                      ₹{(product.finalPrice * quantity).toFixed(0)}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: "1px solid #2a2a2a", paddingTop: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: 13, marginBottom: 8 }}>
                  <span>Subtotal</span><span style={{ color: "#f0f0f0" }}>₹{total.toFixed(0)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#888", fontSize: 13, marginBottom: 14 }}>
                  <span>Shipping</span>
                  <span style={{ color: shipping === 0 ? "#4caf50" : "#f0f0f0", fontWeight: shipping === 0 ? 700 : 400 }}>
                    {shipping === 0 ? "🎉 FREE" : `₹${shipping}`}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderTop: "1px solid #2a2a2a" }}>
                  <span style={{ color: "#f0f0f0", fontWeight: 700, fontSize: 16 }}>TOTAL</span>
                  <span style={{ fontFamily: "'Bebas Neue', cursive", fontSize: 32, color: "#e63946", lineHeight: 1 }}>₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={loading}
            style={{
              background: loading ? "#333" : "linear-gradient(135deg, #e63946, #c1121f)",
              color: "white", border: "none", padding: "18px", borderRadius: 12,
              fontSize: 16, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "'Outfit', sans-serif", letterSpacing: 1,
              boxShadow: loading ? "none" : "0 8px 32px rgba(230,57,70,0.4)",
              transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 10
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
            {loading ? (
              <>
                <div style={{ width: 20, height: 20, border: "2px solid #555", borderTop: "2px solid white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Processing...
              </>
            ) : (
              <>🔒 Pay ₹{grandTotal.toFixed(0)} with Razorpay</>
            )}
          </button>

          <p style={{ color: "#444", fontSize: 11, textAlign: "center" }}>
            By proceeding, you agree to our Terms of Service. Your payment is secured by Razorpay.
          </p>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default CheckoutPage;