# 🎯 Instruções Copilot - Front-end Codecon

## Visão Geral
Este documento define as melhores práticas, convenções e padrões para o desenvolvimento do front-end do projeto **Cagada Remunerada** (Codecon).

---

## ✅ Princípios Fundamentais

### 1. **Type Safety First**
- Sempre use TypeScript. Zero `any` types sem justificativa
- Defina interfaces/types para todos os props, estado e dados da API
- Use discriminated unions para estados complexos

### 2. **Component-Driven Architecture**
- Componentes pequenos, reutilizáveis e testáveis
- Máximo 300 linhas de código por componente
- Separar lógica (hooks) de apresentação (JSX)

### 3. **Performance**
- Use `React.memo()` para componentes que recebem props primitivas
- Implemente `useMemo()` e `useCallback()` onde necessário (não prematuramente)
- Lazy load rotas com `next/dynamic`
- Otimize imagens com `next/image`

### 4. **Acessibilidade**
- Todos os componentes interativos devem ter aria-labels apropriados
- Navegação por teclado sempre funcional
- Contraste mínimo WCAG AA (4.5:1 para texto)
- Use componentes shadcn/ui que já têm acessibilidade integrada

### 5. **Convenções de Código**
- **Nomes de componentes**: PascalCase (`UserCard.tsx`)
- **Nomes de hooks**: camelCase iniciado com `use` (`useUserSession.ts`)
- **Nomes de funções utilitárias**: camelCase (`formatCurrency.ts`)
- **Constantes**: SCREAMING_SNAKE_CASE (`MAX_SESSION_DURATION`)

---

## 📁 Estrutura de Pastas

```
front-end/
├── app/                    # Next.js App Router
├── components/             # Componentes reutilizáveis
│   ├── ui/                # Componentes base (shadcn/ui)
│   ├── features/          # Componentes de features específicas
│   │   ├── sessions/
│   │   ├── ranking/
│   │   ├── feed/
│   │   └── store/
│   └── common/            # Layout, header, footer, etc.
├── hooks/                 # React hooks customizados
├── lib/                   # Utilitários, helpers, auth
├── types/                 # Interfaces e types TypeScript
├── constants/             # Constantes da aplicação
├── styles/                # CSS global (se necessário)
└── .claude/              # Configuração de agentes e skills
```

---

## 🔌 Integração com Backend

### URLs da API
```
DEV:  http://localhost:8000/api
PROD: https://api.codecon.com/api
```

### Padrão de Requisições
```typescript
// ✅ BOM
const response = await fetch(`${API_BASE}/sessions/`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

// ❌ EVITAR
const data = fetch(`http://localhost:8000/api/sessions/`).then(...)
```

### Tratamento de Erros
```typescript
try {
  const data = await apiClient.get('/sessions/');
} catch (error) {
  if (error.status === 401) {
    // Token expirado
    redirect('/login');
  } else if (error.status === 422) {
    // Validação falhou
    showToast(error.data.detail);
  }
}
```

---

## 🎨 Design & Estilização

### Tailwind CSS
- Use apenas classes Tailwind (nunca CSS inline arbitrário)
- Siga a paleta de cores definida em `tailwind.config.js`
- Sempre use dark mode (projeto suporta)

### Componentes UI
- Baseado em shadcn/ui (Radix UI + Tailwind)
- Extensível via CSS modules quando necessário
- Animações via Framer Motion ou Tailwind

### Exemplo de Componente
```typescript
// components/ui/CustomButton.tsx
import { Button } from '@/components/ui/button';

interface CustomButtonProps {
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export function CustomButton({ isLoading, ...props }: CustomButtonProps) {
  return (
    <Button disabled={isLoading} {...props}>
      {isLoading && <Spinner className="mr-2" />}
      {props.children}
    </Button>
  );
}
```

---

## 🧪 Testing

### Estrutura
```
component.tsx
component.test.tsx
```

### Ferramentas
- Jest (test runner)
- React Testing Library (testes de comportamento)
- MSW (mock API calls)

### Exemplo
```typescript
import { render, screen } from '@testing-library/react';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  it('renders user name', () => {
    render(<UserCard user={{ name: 'João' }} />);
    expect(screen.getByText('João')).toBeInTheDocument();
  });
});
```

---

## 📱 Responsive Design

### Breakpoints Tailwind (usar conforme `tailwind.config.js`)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Padrão Mobile-First
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 coluna mobile, 2 tablet, 3 desktop */}
</div>
```

---

## 🔐 Segurança

### Tokens JWT
- **Storage**: localStorage (apenas tokens, nunca PII)
- **Refresh**: Automático ao expirar (usar hook customizado)
- **CORS**: Validado no backend

### Dados Sensíveis
- Nunca envie dados via URL query (usar POST body)
- Valide inputs no frontend (UX) e backend (segurança)
- Sanitize HTML se necessário (DOMPurify)

---

## 📊 Performance Checklist

- [ ] Imagens otimizadas (use `next/image`)
- [ ] Code splitting por rota
- [ ] Componentes lazy-loaded onde apropriado
- [ ] Sem props desnecessárias passadas
- [ ] Sem re-renders evitáveis (memo, useCallback)
- [ ] Bundle size monitorado

---

## 🚀 Deploy

### Build
```bash
npm run build
```

### Variáveis de Ambiente
```
.env.local (gitignored)
.env.production (definido no CI/CD)
```

### Environment Variables Necessárias
```
NEXT_PUBLIC_API_BASE_URL=https://api.codecon.com/api
NEXT_PUBLIC_APP_URL=https://codecon.com
```

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## ❓ Dúvidas?

Consulte os arquivos em `.claude/` ou abra uma issue no repositório.
