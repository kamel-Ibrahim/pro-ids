import api from "./api";

export const login = (email: string, password: string) =>
  api.post("/login", { email, password });

export const register = (data: {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
}) => api.post("/register", data);

export const me = () => api.get("/me");

export const logout = () => api.post("/logout");