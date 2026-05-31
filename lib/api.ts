// lib/api.ts
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://veronique-maniform-nonboastingly.ngrok-free.dev/api";

export type RequestOptions = RequestInit & {
  requiresAuth?: boolean;
  params?: Record<string, string>;
};

export type ApiErrorPayload = {
  detail?: string;
  message?: string;
  [key: string]: unknown;
};

export class ApiError extends Error {
  status: number;
  data: ApiErrorPayload;

  constructor(status: number, data: ApiErrorPayload, message?: string) {
    super(
      message || data.detail || data.message || "Erro catastrófico da API.",
    );
    this.status = status;
    this.data = data;
    this.name = "ApiError";
  }
}

// Cookie helpers for client-side token storage
export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^| )auth_token=([^;]+)/);
  return match ? match[2] : null;
}

export function setTokenCookie(token: string, expiresDays = 7) {
  if (typeof document === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + expiresDays * 24 * 60 * 60 * 1000);
  document.cookie = `auth_token=${token}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

export function removeTokenCookie() {
  if (typeof document === "undefined") return;
  document.cookie =
    "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

// Unified API request runner
async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { requiresAuth = true, params, headers, ...fetchOptions } = options;

  let cleanEndpoint = endpoint;
  if (API_BASE_URL.endsWith("/api") && cleanEndpoint.startsWith("/api/")) {
    cleanEndpoint = cleanEndpoint.substring(4);
  } else if (
    API_BASE_URL.endsWith("/api/") &&
    cleanEndpoint.startsWith("/api/")
  ) {
    cleanEndpoint = cleanEndpoint.substring(5);
  }

  let url = `${API_BASE_URL}${cleanEndpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  const defaultHeaders: Record<string, string> = {
    ...(headers as Record<string, string> | undefined),
  };

  if (API_BASE_URL.includes("ngrok")) {
    defaultHeaders["ngrok-skip-browser-warning"] = "true";
  }

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  } else if (!fetchOptions.body) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  if (requiresAuth) {
    const token = getTokenFromCookie();
    if (token) {
      defaultHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, {
    ...fetchOptions,
    headers: defaultHeaders,
  });

  if (!res.ok) {
    let errorData: ApiErrorPayload;
    try {
      errorData = (await res.json()) as ApiErrorPayload;
    } catch {
      errorData = { message: `API error ${res.status}` };
    }

    // Keep a useful trace for debugging 5xx coming from the backend.
    // This helps distinguish auth/permission crashes vs response-shape issues.

    console.error("API request failed", {
      url,
      status: res.status,
      errorData,
    });

    throw new ApiError(res.status, errorData);
  }

  if (res.status === 204) {
    return null as unknown as T;
  }

  return res.json();
}

// Standard fetch wrapper (matches the signature of the old lib/api.ts apiFetch)
export async function apiFetch(endpoint: string, options: RequestOptions = {}) {
  const isAuthEndpoint =
    endpoint.includes("/auth/login/") || endpoint.includes("/auth/register/");
  return request(endpoint, {
    requiresAuth: !isAuthEndpoint,
    ...options,
  });
}

// Object-based API wrapper (matches the signature of the old lib/api-client.ts api wrapper)
export const api = {
  get: <T>(endpoint: string, opts?: RequestOptions) =>
    request<T>(endpoint, { ...opts, method: "GET" }),
  post: <T>(endpoint: string, body: unknown, opts?: RequestOptions) =>
    request<T>(endpoint, {
      ...opts,
      method: "POST",
      body: JSON.stringify(body),
    }),
  patch: <T>(endpoint: string, body: unknown, opts?: RequestOptions) =>
    request<T>(endpoint, {
      ...opts,
      method: "PATCH",
      body: JSON.stringify(body),
    }),
  delete: <T>(endpoint: string, opts?: RequestOptions) =>
    request<T>(endpoint, { ...opts, method: "DELETE" }),
};
