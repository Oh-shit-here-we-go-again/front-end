---
name: testing-patterns
description: Padrões para testes de componentes e funções
---

# 🧪 Skill: Testing Patterns

**Padrões de testes para componentes React, hooks e funções.**

---

## 🏗️ Setup Inicial

### Dependências
```bash
npm install --save-dev vitest @testing-library/react @testing-library/user-event
npm install --save-dev @testing-library/jest-dom msw
```

### Configuração (vitest.config.ts)
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
```

### Setup (test/setup.ts)
```typescript
import '@testing-library/jest-dom';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## ✅ Testes de Componentes

### Componente Simples
```typescript
// components/Button.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click</Button>);
    
    await user.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('supports disabled state', () => {
    render(<Button disabled>Click</Button>);
    
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Button className="custom">Click</Button>
    );
    
    expect(container.firstChild).toHaveClass('custom');
  });
});
```

### Componente com Estado
```typescript
// components/Counter.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

describe('Counter', () => {
  it('increments count on button click', async () => {
    const user = userEvent.setup();
    
    render(<Counter />);
    
    const button = screen.getByRole('button', { name: '+' });
    
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
    
    await user.click(button);
    
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('accepts initial count prop', () => {
    render(<Counter initialCount={5} />);
    
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });
});
```

### Componente com Efeitos
```typescript
// components/UserProfile.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  it('loads and displays user data', async () => {
    render(<UserProfile userId="123" />);
    
    // Mostra loading enquanto busca
    expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    
    // Espera dados carregar
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    // Mock fetch falhar
    server.use(
      http.get('/api/users/123', () => {
        return HttpResponse.json(
          { error: 'Not found' },
          { status: 404 }
        );
      })
    );
    
    render(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText('Error: User not found')).toBeInTheDocument();
    });
  });
});
```

---

## 🪝 Testes de Hooks

### Hook Customizado
```typescript
// hooks/useCounter.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCounter } from './useCounter';

describe('useCounter', () => {
  it('returns initial count', () => {
    const { result } = renderHook(() => useCounter(0));
    
    expect(result.current.count).toBe(0);
  });

  it('increments count', () => {
    const { result } = renderHook(() => useCounter(0));
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });

  it('accepts custom initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    expect(result.current.count).toBe(10);
  });
});
```

### Hook com Efeito
```typescript
// hooks/useLocalStorage.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('reads from localStorage', () => {
    localStorage.setItem('name', 'John');
    
    const { result } = renderHook(() => useLocalStorage('name'));
    
    expect(result.current[0]).toBe('John');
  });

  it('updates localStorage on state change', () => {
    const { result } = renderHook(() => useLocalStorage('name', 'initial'));
    
    act(() => {
      result.current[1]('Updated');
    });
    
    expect(localStorage.getItem('name')).toBe('Updated');
  });
});
```

---

## 🔄 Testes de Funções Utilitárias

```typescript
// lib/utils.test.ts
import { describe, it, expect } from 'vitest';
import { cn, formatCurrency, truncate } from './utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('handles conditional classes', () => {
    expect(cn('base', true && 'active')).toBe('base active');
    expect(cn('base', false && 'active')).toBe('base');
  });
});

describe('formatCurrency', () => {
  it('formats number as currency', () => {
    expect(formatCurrency(1234.5, 'en-US', 'USD')).toBe('$1,234.50');
  });

  it('formats Brazilian Real', () => {
    expect(formatCurrency(1234.5, 'pt-BR', 'BRL')).toBe('R$ 1.234,50');
  });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    expect(truncate('Hello World', 5)).toBe('Hello...');
  });

  it('returns short strings unchanged', () => {
    expect(truncate('Hi', 10)).toBe('Hi');
  });
});
```

---

## 📡 Testes com Mock API (MSW)

### Configurar Mock Server
```typescript
// test/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'John Doe',
      email: 'john@example.com',
    });
  }),

  http.post('/api/users', async ({ request }) => {
    const body = await request.json();
    
    return HttpResponse.json(
      { ...body, id: '123' },
      { status: 201 }
    );
  }),
];

// test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

### Teste com Mock
```typescript
describe('UserProfile', () => {
  it('fetches and displays user', async () => {
    render(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  it('handles API errors', async () => {
    server.use(
      http.get('/api/users/123', () => {
        return HttpResponse.json(
          { error: 'Not found' },
          { status: 404 }
        );
      })
    );
    
    render(<UserProfile userId="123" />);
    
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```

---

## 📊 Cobertura de Testes

### Executar com Cobertura
```bash
npm run test -- --coverage
```

### Metas de Cobertura
- **Linhas**: >= 80%
- **Branches**: >= 75%
- **Funções**: >= 80%
- **Statements**: >= 80%

### vitest.config.ts
```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.test.{ts,tsx}',
      ],
      lines: 80,
      branches: 75,
      functions: 80,
      statements: 80,
    },
  },
});
```

---

## ✅ Checklist para Testes

- [ ] Teste renderização básica
- [ ] Teste interações do usuário
- [ ] Teste prop validation
- [ ] Teste estados (loading, error, success)
- [ ] Teste edge cases
- [ ] Teste acessibilidade (getByRole)
- [ ] Mock APIs quando necessário
- [ ] Coverage >= 80%
- [ ] Testes são legíveis e bem nomeados
- [ ] Sem testes flaky (não aleatórios)

---

## 🚫 Anti-patterns

```typescript
// ❌ NÃO FAÇA
test('component works', () => {
  render(<Component />);
  // Sem assertions
});

// ❌ Teste implementação, não comportamento
test('sets state to true', () => {
  const { result } = renderHook(...);
  expect(result.current.state).toBe(true);
});

// ❌ Assertions genéricas
expect(element).toBeTruthy();

// ✅ FAÇA
test('displays welcome message when user logs in', () => {
  render(<Component />);
  expect(screen.getByText(/welcome/i)).toBeInTheDocument();
});

// ✅ Teste comportamento, não implementação
test('counter increments when button is clicked', () => {
  // ...
});

// ✅ Assertions específicas
expect(screen.getByRole('button')).toBeDisabled();
```

---

## 📚 Recursos

- [Vitest Docs](https://vitest.dev)
- [React Testing Library](https://testing-library.com/react)
- [MSW Documentation](https://mswjs.io)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
