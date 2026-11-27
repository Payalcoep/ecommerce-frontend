import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import http from "../api/http";
import { useCart } from "../context/CartContext";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    http.get(`/api/product/${id}`).then(r => setProduct(r.data))
      .catch(e => setError(e.response?.data?.message || "Product not found."));
  }, [id]);

  if (error) return <main className="container"><p className="error">{error}</p></main>;
  if (!product) return <p className="center">Loading...</p>;

  const imageUrl = product.imageData
    ? `data:${product.imageType || "image/jpeg"};base64,${product.imageData}`
    : `${apiBase}/api/product/${product.id}/image`;

  return <main className="container detail-layout">
    <div className="detail-image"><img src={imageUrl} alt={product.name}/></div>
    <div className="detail-info"><p className="eyebrow">{product.category}</p><h1>{product.name}</h1>
      <p className="muted">{product.brand}</p><h2>₹{Number(product.price).toLocaleString("en-IN")}</h2>
      <p>{product.description}</p><p>{product.stockQuantity} available</p>
      <button className="button" disabled={!product.stockQuantity} onClick={() => addToCart(product)}>Add to cart</button>
    </div>
  </main>;
}