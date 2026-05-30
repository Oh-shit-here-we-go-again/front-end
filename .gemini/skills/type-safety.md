---
name: type-safety
description: Padrões para garantir 100% type safety no projeto
---

# 🔒 Skill: Type Safety

**Padrões e práticas para manter 100% type safety em todo o projeto.**

---

## 🚫 Zero Tolerância para `any`

### ❌ NUNCA FAÇA
```typescript
const data: any = fetchData();  // Pior coisa que você pode fazer
const { name }: any = user;
let value = someFunction() as any;
```

### ✅ FAÇA ISSO
```typescript
// Defina o type corretamente
interface User {
  name: string;
  email: string;
}

const data: User = fetchData();
const { name }: User = user;

// Ou use type inference
const value = someFunction(); // TypeScript infere o tipo
```

---

## 🏗️ Estratégias de Type Safety

### 1. Type Inference (Deixe TypeScript inferir)
```typescript
// ✅ BOM - TypeScript infere string
const name = 'João';

// ❌ RUIM - explícito desnecessariamente
const name: string = 'João';

// ✅ SEMPRE - quando chamando função
const response = await fetchUser(); // Type vem da função
```

### 2. Discriminated Unions para Estados
```typescript
// ❌ NÃO SEGURO
interface Result {
  status: string;
  data?: any;
  error?: any;
}

// ✅ TYPE SAFE
type Result =
  | { status: 'loading' }
  | { status: 'success'; data: User[] }
  | { status: 'error'; error: Error };

// Uso garante que data existe quando status === 'success'
function handleResult(result: Result) {
  if (result.status === 'success') {
    console.log(result.data); // TypeScript sabe que data existe!
  }
}
```

### 3. Readonly para Imutabilidade
```typescript
// ❌ Pode ser modificado
interface Config {
  apiUrl: string;
  timeout: number;
}

// ✅ Imutável
interface Config {
  readonly apiUrl: string;
  readonly timeout: number;
}

// ✅ Ou array imutável
type ReadonlyList = readonly string[];
```

---

## 📡 Type Safety em API Calls

### Com Validação Runtime (Zod)
```typescript
import { z } from 'zod';

// Define schema
const UserSchema = z.object({
  id: z.string().uuid(),
  username: z.string().min(3),
  email: z.string().email(),
  created_at: z.coerce.date(),
});

// Extrai type
export type User = z.infer<typeof UserSchema>;

// Usa em fetch
async function getUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const data = await response.json();
  
  // Valida em runtime, throws se inválido
  return UserSchema.parse(data);
}
```

### Pagination Type Safe
```typescript
const PaginatedSchema = <T extends z.ZodType>(itemSchema: T) =>
  z.object({
    count: z.number(),
    next: z.string().url().optional(),
    previous: z.string().url().optional(),
    results: z.array(itemSchema),
  });

// Uso
const UserListSchema = PaginatedSchema(UserSchema);
type UserList = z.infer<typeof UserListSchema>;
```

---

## 🎯 Padrões por Contexto

### Props de Componentes
```typescript
// ✅ BOM - Props bem definidas
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
}

export function Button(props: ButtonProps) {
  // ...
}

// ❌ RUIM
export function Button(props: any) {
  // ...
}
```

### Callbacks
```typescript
// ❌ RUIM
const handleClick = (e: any) => {
  console.log(e);
};

// ✅ BOM
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  console.log(e.currentTarget.value);
};

// ✅ MELHOR (com proper typing)
type ClickHandler = (e: React.MouseEvent<HTMLButtonElement>) => void;

const handleClick: ClickHandler = (e) => {
  console.log(e.currentTarget.value);
};
```

### Event Handlers
```typescript
// ✅ Input change
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.currentTarget.value; // type: string
};

// ✅ Select change
const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.currentTarget.value; // type: string
};

// ✅ Form submit
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
};
```

---

## 🔄 Generics para Reutilização

### Generic Function
```typescript
// ❌ SEM GENERIC (repetitivo)
function fetchUsers(): Promise<User[]> {
  return fetch('/api/users').then(r => r.json());
}

function fetchPosts(): Promise<Post[]> {
  return fetch('/api/posts').then(r => r.json());
}

// ✅ COM GENERIC (DRY)
async function fetchList<T>(endpoint: string): Promise<T[]> {
  const response = await fetch(`/api${endpoint}`);
  return response.json();
}

// Uso
const users = await fetchList<User>('/users');
const posts = await fetchList<Post>('/posts');
```

### Generic Component
```typescript
// ✅ Componente que funciona com qualquer tipo
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  keyExtractor: (item: T) => string;
}

export function List<T>({
  items,
  renderItem,
  keyExtractor,
}: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// Uso
<List<User>
  items={users}
  renderItem={user => <div>{user.name}</div>}
  keyExtractor={user => user.id}
/>
```

---

## 🛡️ Utility Types

```typescript
// Extrair tipo de Promise
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type UserData = UnwrapPromise<Promise<User>>; // User

// Extrair keys
type UserKeys = keyof User; // 'id' | 'name' | 'email'

// Partial (props opcionais)
type PartialUser = Partial<User>;

// Required (obrigatório)
type RequiredUser = Required<User>;

// Pick (selecionar propriedades)
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit (excluir propriedades)
type UserWithoutPassword = Omit<User, 'password'>;

// Record (objeto com keys específicas)
type UserRoles = Record<'admin' | 'user' | 'guest', boolean>;

// Exclude (exclui tipos)
type SuccessStatus = Exclude<'loading' | 'success' | 'error', 'loading'>;
```

---

## ✅ Checklist

- [ ] Zero `any` types (sem exceções)
- [ ] Todos os props têm types
- [ ] Callbacks são properly typed
- [ ] APIs validadas com Zod
- [ ] Event handlers têm tipos corretos
- [ ] Discriminated unions para estados complexos
- [ ] Generics usados para evitar repetição
- [ ] Nenhum `// @ts-ignore`
- [ ] Type errors resolvidos, não ignorados
- [ ] Testes validam types em runtime

---

## 📚 Recursos

- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Advanced Types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html)
- [Zod Documentation](https://zod.dev)
- [Type Challenges](https://github.com/type-challenges/type-challenges)
