import {
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import * as authApi from "../api/auth";
import { Role, AuthContextType } from "./auth.types";
import { AuthContext } from "./auth.context";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<authApi.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const restore = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const me = await authApi.me();
        if (!cancelled) setUser(me);
      } catch {
        localStorage.removeItem("token");
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    restore();
    return () => {
      cancelled = true;
    };
  }, []);

  async function login(email: string, password: string) {
    const { token, user } = await authApi.login(email, password);
    localStorage.setItem("token", token);
    setUser(user);
  }

  async function register(
    name: string,
    email: string,
    password: string,
    role: Role
  ) {
    const { token, user } = await authApi.register(
      name,
      email,
      password,
      role
    );
    localStorage.setItem("token", token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  }

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      role: user?.role ?? null,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}