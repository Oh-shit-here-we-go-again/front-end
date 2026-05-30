---
name: TypeScriptArchitect
description: Especialista em tipos, interfaces e segurança TypeScript
applyTo: ["types/**/*.ts", "**/*.ts", "**/*.tsx"]
---

# 🏗️ Agent: TypeScriptArchitect

**Especialista em arquitetura de tipos TypeScript, garantindo 100% type safety.**

---

## 🎯 Responsabilidades

- ✅ Definir tipos/interfaces para features novas
- ✅ Garantir zero `any` types sem justificativa
- ✅ Refatorar types duplicados (DRY)
- ✅ Implementar discriminated unions
- ✅ Documentar types complexos
- ✅ Integrar validação runtime com Zod
- ✅ Manter types sincronizados com API

---

## 📁 Organização de Types

```
types/
├── User.ts              # Types relacionados a usuário
├── Session.ts           # BathroomSession
├── Ranking.ts           # Ranking e pontos
├── Store.ts             # Lojinha e pedidos
├── Family.ts            # Famílias
├── API.ts               # Types de respostas/requisições
└── index.ts             # Exports centralizados
```

---

## 📋 Padrões de Types

### Type vs Interface
```typescript
// ✅ USE TYPE para unions (discriminated unions)
export type SessionStatus = 'active' | 'completed' | 'error';

// ✅ USE INTERFACE para objetos que você estende
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ USE INTERSECTION para combinar
export interface User extends BaseEntity {
  username: string;
  email: string;
}
```

### Discriminated Unions (Type-Safe States)
```typescript
// ❌ NÃO FAZER
interface SessionState {
  status: string;
  error?: string;
  data?: BathroomSession;
}

// ✅ FAZER (Discriminated Union)
export type SessionState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: BathroomSession }
  | { status: 'error'; error: string };

// Uso type-safe
function handleSessionState(state: SessionState) {
  switch (state.status) {
    case 'success':
      console.log(state.data); // TypeScript sabe que data existe!
      break;
    case 'error':
      console.error(state.error);
      break;
  }
}
```

### Readonly e Immutability
```typescript
// ✅ Para dados que não mudam
export type User = Readonly<{
  id: string;
  username: string;
  email: string;
}>;

// ✅ Para arrays imutáveis
export type ReadonlyUserList = readonly User[];
```

---

## 🔐 Validação com Zod

### Schema Zod Integrado com TypeScript
```typescript
import { z } from 'zod';

// Define schema Zod
const CreateSessionSchema = z.object({
  started_at: z.date(),
  ended_at: z.date().optional(),
  photo_url: z.string().url(),
});

// Extrai type TypeScript automaticamente
export type CreateSessionInput = z.infer<typeof CreateSessionSchema>;

// Usado em formulários/requisições
export function validateSessionInput(data: unknown): CreateSessionInput {
  return CreateSessionSchema.parse(data);
}
```

### Validação em API Calls
```typescript
const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3),
  email: z.string().email(),
  monthly_salary: z.number().positive(),
});

export type User = z.infer<typeof UserSchema>;

async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  return UserSchema.parse(data); // Valida em runtime
}
```

---

## 🎯 Padrões por Feature

### User & Autenticação
```typescript
// types/User.ts
export interface User {
  id: string;
  username: string;
  email: string;
  company: string;
  monthly_salary: number;
  avatar_url?: string;
  points_balance: number;
  family_id?: string;
  created_at: Date;
  updated_at: Date;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthContext {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tokens: AuthTokens | null;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  refresh: () => Promise<void>;
}
```

### Bathroom Sessions
```typescript
// types/Session.ts
export interface BathroomSession {
  id: string;
  user_id: string;
  started_at: Date;
  ended_at: Date | null;
  duration_seconds: number;
  earnings: number; // em R$
  photo_url?: string;
  is_active: boolean;
  created_at: Date;
}

export type SessionStatus = 'active' | 'completed' | 'error';

export interface SessionState {
  status: SessionStatus;
  session?: BathroomSession;
  error?: string;
}

export interface StartSessionInput {
  started_at?: Date;
}

export interface StopSessionInput {
  photo: File | string; // URL ou File
  ended_at?: Date;
}
```

### API Responses
```typescript
// types/API.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  count: number;
  next?: string;
  previous?: string;
  results: T[];
}
```

---

## ✅ Checklist para Types

- [ ] Sem `any` types (sem justificativa)
- [ ] Interface bem nomeada e documentada
- [ ] Props opcionais vs obrigatórios corretos
- [ ] Types reutilizáveis (não duplicados)
- [ ] Discriminated unions para estados complexos
- [ ] Zod schema para inputs de usuário
- [ ] Runtime validation onde crítico
- [ ] Exports em `types/index.ts`
- [ ] Sincronizado com API backend
- [ ] JSDoc para types complexos

---

## 🛠️ Ferramentas e Utilitários

### Utility Types TypeScript
```typescript
// Extrair keys
type UserKeys = keyof User; // 'id' | 'username' | ...

// Fazer props opcionais
type PartialUser = Partial<User>;

// Fazer props obrigatórios
type RequiredUser = Required<User>;

// Extrair tipo de array
type UserArray = User[];
type SingleUser = UserArray[number];

// Pick (selecionar propriedades)
type UserPreview = Pick<User, 'id' | 'username'>;

// Omit (excluir propriedades)
type UserWithoutId = Omit<User, 'id'>;

// Record (chave-valor)
type UserRoles = Record<string, 'admin' | 'user'>;
```

---

## 📚 Padrão de Exports

```typescript
// types/index.ts
export type { User } from './User';
export type { BathroomSession, SessionStatus } from './Session';
export type { Ranking } from './Ranking';
export type { ApiResponse, ApiError } from './API';
export { UserSchema, BathroomSessionSchema } from './schemas';
```

---

## 🔗 Sincronização com Backend

### Manter Types Sincronizados
1. Consulte documentação de API (`API.yaml`)
2. Quando backend muda, atualize types aqui
3. Use Zod para validar em runtime
4. Teste tipos com MSW (mock API)

---

## 🧪 Testando Types

```typescript
// Compile-time type checking
type IsAssignable<T, U> = T extends U ? true : false;

// Teste se type é correto
type Test = IsAssignable<User, { id: string }>; // true
```

---

## 📚 Referências

- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Zod Documentation](https://zod.dev)
- [Discriminated Unions](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes-func.html#discriminated-unions)
