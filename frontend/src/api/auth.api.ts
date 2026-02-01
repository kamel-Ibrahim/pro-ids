import axios from "axios";

const API =
  "https://stunning-space-waddle-wrp4wxpqq5rc54r7-8000.app.github.dev/api";

/**
 * LOGIN (student or instructor)
 */
export const loginApi = async (email: string, password: string) => {
  const { data } = await axios.post(`${API}/login`, { email, password });
  return data.data;
};

/**
 * REGISTER (student OR instructor)
 * This keeps the original API but routes to the correct backend endpoint.
 */
export const registerApi = async (
  name: string,
  email: string,
  password: string,
  role: "student" | "instructor"
) => {
  const endpoint =
    role === "instructor"
      ? `${API}/instructor/register`
      : `${API}/register`;

  const { data } = await axios.post(endpoint, {
    name,
    email,
    password,
  });

  return data.data;
};

/**
 * CURRENT USER
 */
export const meApi = async () => {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(`${API}/me`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return data.data;
};

/**
 * LOGOUT
 */
export const logoutApi = async () => {
  const token = localStorage.getItem("token");

  await axios.post(
    `${API}/logout`,
    {},
    {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    }
  );
};