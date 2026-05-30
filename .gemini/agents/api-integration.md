---
name: APIIntegration
description: Especialista em integração com backend Django
applyTo: ["lib/api/**/*.ts", "lib/auth.tsx"]
---

# 🔌 Agent: APIIntegration

**Especialista em integração HTTP com backend Django, autenticação e error handling.**

---

## 🎯 Responsabilidades

- ✅ Criar cliente HTTP reutilizável e type-safe
- ✅ Implementar autenticação JWT
- ✅ Tratar erros consistentemente
- ✅ Implementar retry logic
- ✅ Gerenciar token refresh automático
- ✅ Validar respostas com Zod
- ✅ Documentar endpoints

---

## 🌐 Configuração Base

### Cliente HTTP Reutilizável
```typescript
// lib/api/client.ts
import { ApiError } from '@/types/API';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // ms

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
    this.loadToken();
  }

  /**
   * Define token JWT para autenticação
   */
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Carrega token do localStorage
   */
  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  /**
   * Faz requisição com retry logic
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retries: number = MAX_RETRIES,
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.getHeaders(options.headers);

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw await this.parseError(response);
      }

      return await response.json();
    } catch (error) {
      if (retries > 0 && this.isRetryable(error)) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return this.request<T>(endpoint, options, retries - 1);
      }
      throw error;
    }
  }

  /**
   * Headers padrão
   */
  private getHeaders(customHeaders?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  /**
   * Parse erro de resposta HTTP
   */
  private async parseError(response: Response): Promise<ApiError> {
    const status = response.status;
    let message = response.statusText;
    let details: Record<string, string[]> | undefined;

    try {
      const data = await response.json();
      message = data.detail || data.message || message;
      details = data.details || data.errors;
    } catch {
      // Se não conseguir parsear JSON, usa status text
    }

    return { status, message, details };
  }

  /**
   * Verifica se erro é retentável
   */
  private isRetryable(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.status >= 500 || error.status === 408;
    }
    return error instanceof TypeError; // Network error
  }

  // Métodos convenientes
  get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  patch<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

---

## 🔐 Autenticação JWT

### Login & Token Refresh
```typescript
// lib/api/auth.ts
import { apiClient } from './client';
import { AuthTokens, LoginPayload, User } from '@/types';
import { z } from 'zod';

const LoginResponseSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

/**
 * Login - obtém tokens JWT
 */
export async function login(payload: LoginPayload): Promise<AuthTokens> {
  const response = await apiClient.post<AuthTokens>(
    '/auth/login/',
    payload,
  );
  
  apiClient.setToken(response.access);
  localStorage.setItem('refresh_token', response.refresh);
  
  return response;
}

/**
 * Refresh token - renova access token expirado
 */
export async function refreshToken(): Promise<string> {
  const refreshToken = localStorage.getItem('refresh_token');
  
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await apiClient.post<{ access: string }>(
    '/auth/refresh/',
    { refresh: refreshToken },
  );

  apiClient.setToken(response.access);
  return response.access;
}

/**
 * Logout - remove tokens
 */
export function logout() {
  apiClient.setToken(null);
  localStorage.removeItem('refresh_token');
}

/**
 * Get usuário autenticado
 */
export async function getMe(): Promise<User> {
  return apiClient.get<User>('/auth/me/');
}
```

### Interceptor de Token Expirado
```typescript
// lib/api/interceptor.ts
import { apiClient } from './client';
import { refreshToken, logout } from './auth';

/**
 * Wrapper que trata token expirado automaticamente
 */
export async function callWithTokenRefresh<T>(
  fn: () => Promise<T>,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      try {
        await refreshToken();
        return await fn(); // Tenta novamente com novo token
      } catch {
        logout(); // Token refresh falhou, faz logout
        throw error;
      }
    }
    throw error;
  }
}
```

---

## 📡 Endpoints Organizados

### Estrutura de Arquivos
```
lib/api/
├── client.ts           # Cliente HTTP base
├── auth.ts            # Endpoints de autenticação
├── sessions.ts        # Endpoints de sessões
├── ranking.ts         # Endpoints de ranking
├── store.ts           # Endpoints da lojinha
└── index.ts           # Exports
```

### Exemplo: Sessions API
```typescript
// lib/api/sessions.ts
import { apiClient } from './client';
import { callWithTokenRefresh } from './interceptor';
import { BathroomSession, PaginatedResponse } from '@/types';

/**
 * Lista sessões do usuário (paginado)
 */
export async function listSessions(page: number = 1) {
  return callWithTokenRefresh(() =>
    apiClient.get<PaginatedResponse<BathroomSession>>(
      `/sessions/?page=${page}`,
    ),
  );
}

/**
 * Obter sessão por ID
 */
export async function getSession(id: string) {
  return callWithTokenRefresh(() =>
    apiClient.get<BathroomSession>(`/sessions/${id}/`),
  );
}

/**
 * Iniciar nova sessão
 */
export async function startSession() {
  return callWithTokenRefresh(() =>
    apiClient.post<BathroomSession>('/sessions/start/'),
  );
}

/**
 * Parar sessão com foto
 */
export async function stopSession(
  id: string,
  photo: File | string,
): Promise<BathroomSession> {
  const formData = new FormData();
  
  if (typeof photo === 'string') {
    formData.append('photo_url', photo);
  } else {
    formData.append('photo', photo);
  }

  return callWithTokenRefresh(async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/sessions/${id}/stop/`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiClient.getToken()}`,
        },
        body: formData,
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to stop session: ${response.statusText}`);
    }

    return response.json();
  });
}
```

---

## ⚠️ Error Handling

### Captura e Conversão de Erros
```typescript
// lib/api/errors.ts
import { ApiError as ApiErrorType } from '@/types';

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Parse erro de resposta da API
 */
export async function parseApiError(response: Response): Promise<never> {
  const status = response.status;
  
  try {
    const data = await response.json();
    throw new ApiError(
      status,
      data.detail || data.message || response.statusText,
      data.details || data.errors,
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(status, response.statusText);
  }
}

/**
 * User-friendly mensagens de erro
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return 'Sessão expirada. Faça login novamente.';
    if (error.status === 403) return 'Você não tem permissão para isso.';
    if (error.status === 404) return 'Recurso não encontrado.';
    if (error.status >= 500) return 'Erro no servidor. Tente novamente.';
    return error.message;
  }
  return 'Erro desconhecido. Tente novamente.';
}
```

### Uso em Componentes
```typescript
'use client';

import { useState } from 'react';
import { listSessions } from '@/lib/api/sessions';
import { getErrorMessage } from '@/lib/api/errors';
import { useToast } from '@/hooks/useToast';

export function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadSessions = async () => {
    setLoading(true);
    try {
      const data = await listSessions();
      setSessions(data.results);
    } catch (error) {
      toast({
        title: 'Erro',
        description: getErrorMessage(error),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ... */}
    </div>
  );
}
```

---

## ✅ Checklist

- [ ] Endpoint definido em arquivo apropriado
- [ ] Type-safe (Zod schema para validação)
- [ ] Inclui autenticação (Bearer token)
- [ ] Error handling implementado
- [ ] Retry logic para falhas de rede
- [ ] JSDoc comentário explicando função
- [ ] Teste manual com Backend funcionando
- [ ] Tratamento de token expirado
- [ ] Exports em `lib/api/index.ts`

---

## 🧪 Testando API

### Com MSW (Mock Service Worker)
```typescript
// mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/sessions/', () => {
    return HttpResponse.json({
      count: 1,
      results: [{ id: '123', duration_seconds: 600 }],
    });
  }),

  http.post('/api/sessions/start/', () => {
    return HttpResponse.json({
      id: '123',
      started_at: new Date(),
    });
  }),
];
```

---

## 🔗 Referências

- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JWT Authentication](https://jwt.io)
- [MSW Documentation](https://mswjs.io)
- Backend API: `/docs/backend/api.md`
