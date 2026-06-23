import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";

const AuthContext = createContext(null);
const TOKEN_KEY = "ji_ledger_token";
const LEGACY_KEYS = ["chainforge_token"];

function readToken() {
  let token = localStorage.getItem(TOKEN_KEY);
  if (token) return token;
  for (const key of LEGACY_KEYS) {
    const legacy = localStorage.getItem(key);
    if (legacy) {
      localStorage.setItem(TOKEN_KEY, legacy);
      localStorage.removeItem(key);
      return legacy;
    }
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = readToken();
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then(({ data }) => setUser(data))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (!data.token) throw new Error("No token received");
      localStorage.setItem(TOKEN_KEY, data.token);
      setUser(data.user);
      return data.user;
    } catch (err) {
      console.error("Login error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: { url: err.config?.url, method: err.config?.method, baseURL: err.config?.baseURL },
      });
      throw err;
    }
  };

  const register = async (email, username, password, phone) => {
    const payload = { email, username, password };
    if (phone) payload.phone = phone;
    const { data } = await api.post("/auth/register", payload);
    if (!data.token) throw new Error("No token received");
    localStorage.setItem(TOKEN_KEY, data.token);
    setUser(data.user);
    return data.user;
  };

  const siwe = (token, userObj) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser(userObj);
    return userObj;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, siwe, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
