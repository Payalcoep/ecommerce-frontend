import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import http from "../api/http";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    http.get("/api/orders/my-orders").then(r => setOrders(r.data))
      .catch(e => setError(e.response?.data?.message || "Could not load your orders."));
  }, []);

  return <main className="container"><p className="eyebrow">PURCHASE HISTORY</p><h1>My orders</h1>
    {location.state?.orderId && <p className="success">Order placed: {location.state.orderId}</p>}
    {error && <p className="error">{error}</p>}
    {!error && !orders.length ? <div className="empty"><p>You have not placed any orders yet.</p><Link to="/" className="button">Explore products</Link></div> :
      <div className="orders-list">{orders.map(order => <article className="order-card" key={order.orderId}>
        <div className="order-top"><div><strong>{order.orderId}</strong><p className="muted">{order.orderDate}</p></div><span className="status">{order.status}</span></div>
        {(order.items || []).map((item, i) => <p key={i}>{item.productName} × {item.quantity} — ₹{Number(item.totalPrice).toLocaleString("en-IN")}</p>)}
        <strong>Total: ₹{Number(order.totalAmount || 0).toLocaleString("en-IN")}</strong>
      </article>)}</div>}
  </main>;
}