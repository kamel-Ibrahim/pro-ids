import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { apiRequest } from "../api/http";

export type Role = "student" | "instructor" | "admin";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: Role;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: Role
  ) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const isAuthenticated = !!token;

  // 🔁 Load user from token on refresh
  useEffect(() => {
    if (!token) return;

    apiRequest("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(setUser)
      .catch(() => logout());
  }, [token]);

  async function login(email: string, password: string) {
    const res = await apiRequest("/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.user);
  }

  async function register(
    name: string,
    email: string,
    password: string,
    role: Role
  ) {
    const res = await apiRequest("/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });

    localStorage.setItem("token", res.token);
    setToken(res.token);
    setUser(res.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
