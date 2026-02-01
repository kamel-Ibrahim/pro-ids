import { createContext } from "react";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
};

export type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role?: "student" | "instructor"
  ) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);