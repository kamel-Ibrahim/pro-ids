const API_BASE =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export async function apiRequest(
  path: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    let message = "API error";
    try {
      const data = await res.json();
      message = data.message || data.error || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}
