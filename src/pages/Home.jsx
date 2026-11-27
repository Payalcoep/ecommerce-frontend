import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import http from "../api/http";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchProducts(search = "") {
    setLoading(true); setError("");
    try {
      const response = search.trim()
        ? await http.get("/api/products/search", { params: { keyword: search } })
        : await http.get("/api/products");
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load products. Check that Spring Boot is running.");
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchProducts(); }, []);

  function submitSearch(e) {
    e.preventDefault();
    fetchProducts(keyword);
  }

  return (
    <main className="container">
      <section className="hero">
        <div><p className="eyebrow">EVERYDAY FINDS, BETTER PRICES</p>
          <h1>Find something<br/><span>you’ll love.</span></h1>
          <p className="hero-copy">Explore the latest products, add your favourites to cart and order with ease.</p>
        </div>
        <div className="hero-art"><ShoppingIllustration /></div>
      </section>
      <div className="section-heading">
        <div><p className="eyebrow">OUR COLLECTION</p><h2>Shop products</h2></div>
        <form className="search" onSubmit={submitSearch}>
          <Search size={18}/><input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Search products..."/>
          <button className="button">Search</button>
        </form>
      </div>
      {loading ? <p className="center">Loading products...</p> :
        error ? <p className="error">{error}</p> :
        products.length ? <div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p}/>)}</div> :
        <p className="empty">No products found.</p>}
    </main>
  );
}

function ShoppingIllustration() {
  return <div className="bag-illustration"><span>✦</span><div className="bag-handle"/><div className="bag-body">P</div><i>✧</i></div>;
}