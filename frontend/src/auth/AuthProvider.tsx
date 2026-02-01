import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { User } from "../types/user";
import { AuthContext } from "./auth.context";
import * as AuthAPI from "../api/auth.api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(!!token);

  useEffect(() => {
    if (!token) return;

    AuthAPI.me()
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await AuthAPI.login(email, password);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "student" | "instructor"
  ) => {
    const res = await AuthAPI.register({
      name,
      email,
      password,
      role,
    });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}