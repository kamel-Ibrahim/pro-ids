import { useEffect, useState } from "react";
import api, { unwrap } from "../api/api";
import type { ApiError } from "../api/api";
import { AuthContext, type AuthUser } from "./auth.context";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/me")
      .then((res) => unwrap<AuthUser>(res))
      .then((me) => setUser(me))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await api.post("/login", { email, password });
      const me = await api.get("/me").then((r) => unwrap<AuthUser>(r));
      setUser(me);
    } catch (e) {
      const err = e as ApiError;
      throw new Error(err.message);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    try {
      await api.post("/register", { name, email, password });
      const me = await api.get("/me").then((r) => unwrap<AuthUser>(r));
      setUser(me);
    } catch (e) {
      const err = e as ApiError;
      throw new Error(err.message);
    }
  };

  const logout = async () => {
    await api.post("/logout");
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