import http, { unwrapData } from "./http";

type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "student" | "instructor";
};

export const register = (data: RegisterPayload) =>
  http.post("/register", data).then(unwrapData);

export const login = (data: { email: string; password: string }) =>
  http.post("/login", data).then(unwrapData);

export const me = () =>
  http.get<AuthUser>("/me").then(unwrapData);

export const logout = () =>
  http.post("/logout").then(() => undefined);