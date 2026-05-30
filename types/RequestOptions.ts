// types/RequestOptions.ts
export type RequestOptions = RequestInit & {
  requiresAuth?: boolean;
};

async function request<T>(endpoint: string, options: RequestOptions) {
  const { requiresAuth = true, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers as Record<string, string> | undefined),
  };

  if (requiresAuth) {
    const token = getTokenFromCookie();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }
  const resMerda = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      ...fetchOptions,
      headers,
    },
  );

  if (!resMerda.ok) {
    const errorData = await resMerda.json();
    throw new Error(errorData.message || "Ocorreu um erro na requisição");
  }

  const responseText = await resMerda.text();
  if (responseText === "") {
    return null;
  }

  return JSON.parse(responseText);
}

// Função auxiliar para ler token cagado do cookie (client-side)
export function getTokenFromCookie(): string | null {
  if (typeof window === "undefined") return null;
  const match = document.cookie.match(/(^| )auth_token=([^;]+)/);
  return match ? match[2] : null;
}

export function setTokenCookie(token: string, expiresDays = 7) {
  if (typeof window === "undefined") return;
  const date = new Date();
  date.setTime(date.getTime() + expiresDays * 24 * 60 * 60 * 1000);
  document.cookie = `auth_token=${token}; expires=${date.toUTCString()}; path=/; SameSite = lax`;
}

export function removeTokenCookie() {
  document.cookie =
    "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}
