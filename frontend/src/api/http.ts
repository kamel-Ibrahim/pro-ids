import axios, { AxiosError } from "axios";

/**
 * What Laravel sends back on errors
 */
type BackendErrorResponse = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

/**
 * What the frontend will ALWAYS receive
 */
export type ApiError = {
  status: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const http = axios.create({
  baseURL:
    "https://stunning-space-waddle-wrp4wxpqq5rc54r7-8000.app.github.dev/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach JWT token
 */
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 🔥 Normalize ALL errors (NO `any`)
 */
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorResponse>) => {
    const apiError: ApiError = {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong",
      fieldErrors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

export default http;