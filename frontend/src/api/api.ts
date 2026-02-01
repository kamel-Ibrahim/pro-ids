import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

/**
 * What Laravel commonly sends back on errors.
 * (We normalize these into ApiError below.)
 */
type BackendErrorResponse = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

/**
 * What the frontend will ALWAYS receive in `catch`.
 */
export type ApiError = {
  status: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const isApiError = (e: unknown): e is ApiError => {
  if (typeof e !== "object" || e === null) return false;
  const rec = e as Record<string, unknown>;
  return typeof rec.status === "number" && typeof rec.message === "string";
};

/**
 * Laravel paginator shape (used by /courses index after we switched to paginate()).
 */
export type LaravelPaginator<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export const isLaravelPaginator = <T>(v: unknown): v is LaravelPaginator<T> => {
  if (typeof v !== "object" || v === null) return false;
  const rec = v as Record<string, unknown>;
  return (
    Array.isArray(rec.data) &&
    typeof rec.current_page === "number" &&
    typeof rec.last_page === "number" &&
    typeof rec.per_page === "number" &&
    typeof rec.total === "number"
  );
};

/**
 * Unwrap typical API responses:
 * - If backend returns { data: ... } (resource wrappers)
 * - Or if backend returns raw object/array
 */
export const unwrap = <T>(res: AxiosResponse<unknown>): T => {
  const body = res.data;
  if (typeof body === "object" && body !== null) {
    const rec = body as Record<string, unknown>;
    if ("data" in rec) return rec.data as T;
  }
  return body as T;
};

/**
 * If endpoint might return either T[] or LaravelPaginator<T>, this gives you just the list.
 */
export const unwrapList = <T>(res: AxiosResponse<unknown>): T[] => {
  const body = res.data;
  if (isLaravelPaginator<T>(body)) return body.data;
  if (typeof body === "object" && body !== null) {
    const rec = body as Record<string, unknown>;
    if (Array.isArray(rec.data)) return rec.data as T[];
  }
  return body as T[];
};

const baseURL = (import.meta as unknown as { env?: Record<string, string> }).env
  ?.VITE_API_BASE_URL;

export const api = axios.create({
  // Dev: vite proxy uses /api. Prod: set VITE_API_BASE_URL.
  baseURL: baseURL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorResponse>) => {
    const apiError: ApiError = {
      status: error.response?.status ?? 0,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong",
      fieldErrors: error.response?.data?.errors,
    };

    // If user is unauthorized, clear token so app can react (ProtectedRoute redirects)
    if (apiError.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(apiError);
  }
);

export default api;
