import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ adminOnly = false }) {
  const { token, user, loading } = useAuth();
  if (loading) return <p className="center">Loading...</p>;
  if (!token) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== "ADMIN") return <Navigate to="/" replace />;
  return <Outlet />;
}