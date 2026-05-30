// lib/api-client.ts
const API_BASE_URL =
  process.env.NEXT_API_URL ||
  "https://psephological-trigonally-gaynelle.ngrok-free.app/api";

type RequestOptions = RequestInit & {
  requiresAuth?: boolean;
};

async function request<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  if (requiresAuth) {
    const token = getTokenFromCookie(); // implementada abaixo
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || `API error ${res.status}`);
  }

  return res.json();
}

// Função auxiliar para ler token do cookie (client-side)
export function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(^| )auth_token=([^;]+)/);
  return match ? match[2] : null;
}

export function setTokenCookie(token: string, expiresDays = 7) {
  const date = new Date();
  date.setTime(date.getTime() + expiresDays * 24 * 60 * 60 * 1000);
  document.cookie = `auth_token=${token}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

export function removeTokenCookie() {
  document.cookie =
    "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

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
