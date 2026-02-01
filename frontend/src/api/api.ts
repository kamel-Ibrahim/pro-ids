import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

/* =======================
   Backend error shape
======================= */
type BackendErrorResponse = {
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
};

/* =======================
   Public API error
======================= */
export type ApiError = {
  status: number;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export const isApiError = (e: unknown): e is ApiError => {
  if (typeof e !== "object" || e === null) return false;
  const r = e as Record<string, unknown>;
  return typeof r.status === "number" && typeof r.message === "string";
};

/* =======================
   Unwrap helpers
======================= */
export const unwrap = <T = unknown>(res: AxiosResponse<unknown>): T => {
  const body = res.data;
  if (typeof body === "object" && body !== null && "data" in body) {
    return (body as { data: T }).data;
  }
  return body as T;
};

export const unwrapList = <T = unknown>(
  res: AxiosResponse<unknown>
): T[] => {
  const body = res.data;
  if (typeof body === "object" && body !== null && "data" in body) {
    return (body as { data: T[] }).data;
  }
  return body as T[];
};

/* =======================
   Axios instance (COOKIE AUTH)
======================= */
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // 🔥 REQUIRED FOR LARAVEL SESSION AUTH
});

/* =======================
   Request interceptor
   (NO JWT!)
======================= */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  return config;
});

/* =======================
   Response interceptor
======================= */
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError<BackendErrorResponse>) => {
    const status = error.response?.status ?? 0;
    const url = error.config?.url;

    // ✅ Expected case: user not logged in yet
    if (status === 401 && url === "/me") {
      return Promise.reject(error);
    }

    const apiError: ApiError = {
      status,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Something went wrong",
      fieldErrors: error.response?.data?.errors,
    };

    return Promise.reject(apiError);
  }
);

export default api;