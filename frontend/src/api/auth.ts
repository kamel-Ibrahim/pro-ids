import api from "./client";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "student" | "instructor";
};

type AuthResponse = {
  token: string;
  user: User;
};

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: "student" | "instructor"
): Promise<AuthResponse> {
  const { data } = await api.post("/auth/register", {
    name,
    email,
    password,
    role,
  });
  return data;
}

export async function me(): Promise<User> {
  const { data } = await api.get("/auth/me");
  return data;
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}