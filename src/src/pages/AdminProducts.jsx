import { useEffect, useState } from "react";
import http from "../api/http";

const emptyForm = { name: "", description: "", brand: "", price: "", category: "", productAvailable: true, stockQuantity: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try { const r = await http.get("/api/products"); setProducts(r.data); }
    catch (e) { setError(e.response?.data?.message || "Could not load products."); }
  }
  useEffect(() => { load(); }, []);

  function updateField(e) {
    const { name, value, type, checked } = e.target;
    setForm(old => ({ ...old, [name]: type === "checkbox" ? checked : value }));
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({ name: product.name || "", description: product.description || "", brand: product.brand || "",
      price: product.price ?? "", category: product.category || "", productAvailable: Boolean(product.productAvailable),
      stockQuantity: product.stockQuantity ?? "" });
    setImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function submit(e) {
    e.preventDefault(); setError(""); setMessage("");
    const data = new FormData();
    data.append("product", new Blob([JSON.stringify({
      ...form, price: Number(form.price), stockQuantity: Number(form.stockQuantity)
    })], { type: "application/json" }));
    if (image) data.append("imageFile", image);
    try {
      if (editingId) await http.put(`/api/product/${editingId}`, data, { headers: { "Content-Type": "multipart/form-data" } });
      else {
        if (!image) { setError("Please select an image for the new product."); return; }
        await http.post("/api/product", data, { headers: { "Content-Type": "multipart/form-data" } });
      }
      setMessage(editingId ? "Product updated." : "Product added.");
      setForm(emptyForm); setImage(null); setEditingId(null); await load();
    } catch (e) { setError(e.response?.data?.message || "Save failed. Check your backend multipart endpoint."); }
  }

  async function remove(id) {
    if (!window.confirm("Delete this product?")) return;
    try { await http.delete(`/api/products/${id}`); setMessage("Product deleted."); await load(); }
    catch (e) { setError(e.response?.data?.message || "Delete failed."); }
  }

  return <main className="container"><p className="eyebrow">STORE ADMINISTRATION</p><h1>Manage products</h1>
    {message && <p className="success">{message}</p>}{error && <p className="error">{error}</p>}
    <form className="admin-form" onSubmit={submit}>
      <h2>{editingId ? `Edit product #${editingId}` : "Add a product"}</h2>
      <div className="form-grid">
        <label>Product name<input name="name" required value={form.name} onChange={updateField}/></label>
        <label>Brand<input name="brand" value={form.brand} onChange={updateField}/></label>
        <label>Category<input name="category" required value={form.category} onChange={updateField}/></label>
        <label>Price<input name="price" type="number" min="0" step="0.01" required value={form.price} onChange={updateField}/></label>
        <label>Stock quantity<input name="stockQuantity" type="number" min="0" required value={form.stockQuantity} onChange={updateField}/></label>
        <label>Image {editingId && <span className="muted">(optional if backend supports it)</span>}<input type="file" accept="image/*" onChange={e => setImage(e.target.files[0] || null)}/></label>
        <label className="span-2">Description<textarea name="description" value={form.description} onChange={updateField}/></label>
        <label className="check-label"><input name="productAvailable" type="checkbox" checked={form.productAvailable} onChange={updateField}/> Product available</label>
      </div>
      <div className="button-row"><button className="button">{editingId ? "Save changes" : "Add product"}</button>
        {editingId && <button type="button" className="button button-outline" onClick={() => {setEditingId(null);setForm(emptyForm);setImage(null);}}>Cancel edit</button>}</div>
    </form>
    <h2 className="list-title">Existing products</h2>
    <div className="admin-list">{products.map(p => <div className="admin-row" key={p.id}>
      <div><strong>{p.name}</strong><p className="muted">ID: {p.id} · ₹{p.price} · Stock: {p.stockQuantity}</p></div>
      <div className="button-row"><button className="button button-outline small" onClick={() => startEdit(p)}>Edit</button><button className="button button-danger small" onClick={() => remove(p.id)}>Delete</button></div>
    </div>)}</div>
  </main>;
}