import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";

/**
 * Laravel error shape
 */
type BackendErrorResponse = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

/**
 * Normalized frontend error
 */
export type ApiError = {
  status: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Laravel pagination shape
 */
export type LaravelPaginated<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

/**
 * Axios instance
 */
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
 * Normalize ALL backend errors
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

/**
 * ✅ Typed unwrap (NO any)
 */
export const unwrapData = <T>(
  res: AxiosResponse<T | { data: T }>
): T => {
  if (typeof res.data === "object" && res.data !== null && "data" in res.data) {
    return (res.data as { data: T }).data;
  }
  return res.data as T;
};

export const isApiError = (err: unknown): err is ApiError =>
  typeof err === "object" &&
  err !== null &&
  "status" in err &&
  "message" in err;

export default http;