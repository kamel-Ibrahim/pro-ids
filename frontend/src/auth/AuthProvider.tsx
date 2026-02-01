import { useEffect, useState, type ReactNode } from "react";
import api, { unwrap } from "../api/api";
import type { ApiError } from "../api/api";
import { AuthContext, type AuthUser } from "./auth.context";

type AuthResponse = {
  token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Bootstrap auth if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/me")
      .then((res) => unwrap<AuthUser>(res))
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/login", { email, password });

      const data = unwrap<AuthResponse>(res);

      // ✅ CORRECT PATH
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (e) {
      const err = e as ApiError;
      throw new Error(err.message || "Login failed");
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await api.post("/register", { name, email, password });

      const data = unwrap<AuthResponse>(res);

      // ✅ AUTO-LOGIN AFTER REGISTER (BACKEND SUPPORTS IT)
      localStorage.setItem("token", data.token);
      setUser(data.user);
    } catch (e) {
      const err = e as ApiError;
      throw new Error(err.message || "Registration failed");
    }
  };

  const logout = async () => {
    await api.post("/logout");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}