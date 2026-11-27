import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import http from "../api/http";
import { useState } from "react";

export default function Cart() {
  const { items, total, changeQuantity, removeItem, clearCart } = useCart();
  const { token } = useAuth();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function checkout() {
    if (!token) { navigate("/login"); return; }
    setBusy(true); setError("");
    try {
      const response = await http.post("/api/orders", {
        items: items.map(item => ({ productId: item.id, quantity: item.quantity }))
      });
      clearCart();
      navigate("/orders", { state: { orderId: response.data.orderId } });
    } catch (err) {
      setError(err.response?.data?.message || "Order could not be placed. Check product stock and backend logs.");
    } finally { setBusy(false); }
  }

  if (!items.length) return <main className="container"><div className="empty"><h2>Your cart is empty</h2><Link className="button" to="/">Continue shopping</Link></div></main>;

  return <main className="container"><p className="eyebrow">YOUR SELECTION</p><h1>Shopping cart</h1>
    {error && <p className="error">{error}</p>}
    <div className="cart-layout"><div className="cart-items">
      {items.map(item => <div className="cart-item" key={item.id}>
        <div><strong>{item.name}</strong><p className="muted">₹{Number(item.price).toLocaleString("en-IN")} each</p></div>
        <input aria-label="Quantity" type="number" min="1" max={item.stockQuantity} value={item.quantity}
          onChange={e => changeQuantity(item.id, Math.min(Number(e.target.value), item.stockQuantity || 1))}/>
        <strong>₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</strong>
        <button className="text-button" onClick={() => removeItem(item.id)}>Remove</button>
      </div>)}
    </div><aside className="summary"><h3>Order summary</h3><p><span>Subtotal</span><strong>₹{total.toLocaleString("en-IN")}</strong></p><p><span>Shipping</span><strong>Calculated later</strong></p><hr/><p><strong>Total</strong><strong>₹{total.toLocaleString("en-IN")}</strong></p>
      <button className="button full" onClick={checkout} disabled={busy}>{busy ? "Placing order..." : "Place order"}</button>
    </aside></div>
  </main>;
}