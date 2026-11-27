import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <Link className="brand" to="/">PAYAL<span>STORE</span></Link>
      <nav>
        <Link to="/">Products</Link>
        {token && <Link to="/orders">My orders</Link>}
        {user?.role === "ADMIN" && <Link to="/admin/products">Manage products</Link>}
        <Link to="/cart" className="cart-link"><ShoppingBag size={18}/> Cart ({count})</Link>
      </nav>
      <div className="nav-user">
        {token ? <>
          <span><User size={16}/> {user?.username || "Account"} ({user?.role || "..."})</span>
          <button className="button button-outline small" onClick={handleLogout}><LogOut size={15}/> Logout</button>
        </> : <Link className="button small" to="/login">Login</Link>}
      </div>
    </header>
  );
}