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
   Axios instance
======================= */
const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
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

export default api;