import { useEffect, useState } from "react";
import { AuthContext } from "./auth.context";
import type { User, UserRole } from "./auth.types";
import {
  login as loginRequest,
  register as registerRequest,
  me as meRequest,
  logout as logoutRequest,
} from "../api/auth.api";
import http, { ApiError } from "../api/http";

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  // Calculate isAuthenticated
  const isAuthenticated = !!token && !!user;

  // Keep localStorage in sync. The http client reads the token per-request.
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // Global 401 handler (on our configured http client)
  useEffect(() => {
    const interceptorId = http.interceptors.response.use(
      (res) => res,
      async (error: unknown) => {
        const e = error as Partial<ApiError>;
        if (e && typeof e.status === "number" && e.status === 401) {
          await hardLogout();
        }
        return Promise.reject(error);
      }
    );

    return () => http.interceptors.response.eject(interceptorId);
  }, []);

  // Hydrate user
  useEffect(() => {
    const hydrate = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const meUser = await meRequest();
        setUser(meUser);
      } catch {
        await hardLogout();
      } finally {
        setLoading(false);
      }
    };

    hydrate();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await loginRequest(email, password);
    setToken(res.token);
    setUser(res.user);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ) => {
    const res = await registerRequest(name, email, password, role);
    setToken(res.token);
    setUser(res.user);
  };

  const hardLogout = async () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      await hardLogout();
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        user, 
        token, 
        loading, 
        isAuthenticated,
        login, 
        register, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}