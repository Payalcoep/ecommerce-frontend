import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault(); setError(""); setMessage(""); setBusy(true);
    try {
      await register(username, password);
      setMessage("Registration successful. You can now log in.");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Check your details.");
    } finally { setBusy(false); }
  }

  return <main className="auth-wrap"><form className="auth-card" onSubmit={submit}>
    <p className="eyebrow">JOIN OUR STORE</p><h1>Create account</h1><p className="muted">New accounts are registered with the USER role.</p>
    {error && <p className="error">{error}</p>}{message && <p className="success">{message}</p>}
    <label>Username<input required value={username} onChange={e => setUsername(e.target.value)} autoComplete="username"/></label>
    <label>Password<input required type="password" minLength="6" value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password"/></label>
    <button className="button full" disabled={busy}>{busy ? "Creating..." : "Register"}</button>
    <p className="auth-bottom">Already registered? <Link to="/login">Login</Link></p>
  </form></main>;
}