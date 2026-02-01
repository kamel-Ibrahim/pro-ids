import api, { unwrap } from "./api";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export const register = (data: {
  name: string;
  email: string;
  password: string;
}) => api.post("/register", data).then(unwrap);

export const login = (data: { email: string; password: string }) =>
  api.post("/login", data).then(unwrap);

export const me = () => api.get("/me").then(unwrap);

export const logout = () => api.post("/logout").then(() => undefined);