import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import AdminProducts from "./pages/AdminProducts";

export default function App() {
  return <>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
      </Route>
      <Route element={<ProtectedRoute adminOnly />}>
        <Route path="/admin/products" element={<AdminProducts />} />
      </Route>
      <Route path="*" element={<main className="container"><h1>Page not found</h1></main>} />
    </Routes>
    <footer className="footer">© {new Date().getFullYear()} Payal Store · Built with React + Spring Boot</footer>
  </>;
}