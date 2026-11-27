import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try {
      const profile = await login(username, password);
      navigate(profile.role === "ADMIN" ? "/admin/products" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Check your username and password. Also verify the /api/users/me endpoint exists.");
    } finally { setBusy(false); }
  }

  return <main className="auth-wrap"><form className="auth-card" onSubmit={submit}>
    <p className="eyebrow">WELCOME BACK</p><h1>Login</h1><p className="muted">Sign in to continue to your account.</p>
    {error && <p className="error">{error}</p>}
    <label>Username<input required value={username} onChange={e => setUsername(e.target.value)} autoComplete="username"/></label>
    <label>Password<input required type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password"/></label>
    <button className="button full" disabled={busy}>{busy ? "Signing in..." : "Login"}</button>
    <p className="auth-bottom">New here? <Link to="/register">Create an account</Link></p>
  </form></main>;
}