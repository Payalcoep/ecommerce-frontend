import { createContext, useContext, useEffect, useState } from "react";
import http from "../api/http";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(localStorage.getItem("token")));

  async function loadProfile() {
    const response = await http.get("/api/users/me");
    setUser(response.data);
    return response.data;
  }

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    loadProfile()
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function login(username, password) {
    const response = await http.post("/login", { username, password });
    const newToken = response.data.token;
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const profileResponse = await http.get("/api/users/me", {
      headers: { Authorization: `Bearer ${newToken}` }
    });
    setUser(profileResponse.data);
    return profileResponse.data;
  }

  async function register(username, password) {
    return http.post("/register", { username, password });
  }

  async function logout() {
    try {
      if (token) await http.post("/logout");
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);