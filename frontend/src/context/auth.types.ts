import * as authApi from "../api/auth";

export type Role = "student" | "instructor";

export type AuthContextType = {
  user: authApi.User | null;
  role: Role | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: Role
  ) => Promise<void>;
  logout: () => void;
};