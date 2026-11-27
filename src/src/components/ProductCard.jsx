import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const imageUrl = product.imageData
    ? `data:${product.imageType || "image/jpeg"};base64,${product.imageData}`
    : `${apiBase}/api/product/${product.id}/image`;

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image">
        <img src={imageUrl} alt={product.name} onError={e => { e.currentTarget.style.display = "none"; }} />
        <span className="image-placeholder">No image</span>
      </Link>
      <div className="product-info">
        <p className="muted">{product.brand || product.category}</p>
        <Link className="product-name" to={`/products/${product.id}`}>{product.name}</Link>
        <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
        <p className={product.stockQuantity > 0 ? "stock" : "out-stock"}>
          {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}
        </p>
        <button className="button full" disabled={!product.stockQuantity} onClick={() => addToCart(product)}>
          Add to cart
        </button>
      </div>
    </article>
  );
}