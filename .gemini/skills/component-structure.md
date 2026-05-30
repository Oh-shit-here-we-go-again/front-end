---
name: component-structure
description: Estrutura padrão para criar novo componente React
---

# 🏗️ Skill: Component Structure

**Define a estrutura padrão para novos componentes React no projeto.**

---

## 📝 Template Básico

```typescript
// components/features/[feature]/[ComponentName].tsx
import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Props para [ComponentName]
 * 
 * @example
 * <ComponentName title="Exemplo" />
 */
interface ComponentNameProps {
  /** Título principal */
  title: string;
  /** Classe CSS adicional */
  className?: string;
}

/**
 * [ComponentName] - Descrição breve do componente
 * 
 * Descrição mais detalhada explicando:
 * - Seu propósito
 * - Quando usar
 * - Comportamento principal
 * 
 * @example
 * ```tsx
 * <ComponentName title="Meu Componente" />
 * ```
 */
export function ComponentName({ title, className }: ComponentNameProps) {
  return (
    <div className={cn('base-classes', className)}>
      <h2 className="text-lg font-semibold">{title}</h2>
    </div>
  );
}
```

---

## 📋 Template com Estado

```typescript
// components/features/[feature]/[ComponentName].tsx
'use client';

import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

/**
 * [ComponentName] - Componente com estado local
 */
export function ComponentName({
  initialValue = '',
  onChange,
  className,
}: ComponentNameProps) {
  const [value, setValue] = useState(initialValue);

  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    onChange?.(newValue);
  }, [onChange]);

  return (
    <div className={cn('space-y-4', className)}>
      <input
        type="text"
        value={value}
        onChange={e => handleChange(e.target.value)}
        className="w-full px-3 py-2 border rounded"
      />
      <p className="text-sm text-gray-600">Valor: {value}</p>
    </div>
  );
}
```

---

## 🪝 Template com Hook Customizado

```typescript
// components/features/[feature]/[ComponentName].tsx
'use client';

import { useCustomHook } from '@/hooks/useCustomHook';
import { cn } from '@/lib/utils';

interface ComponentNameProps {
  id: string;
  className?: string;
}

/**
 * [ComponentName] - Componente que usa hook customizado
 */
export function ComponentName({ id, className }: ComponentNameProps) {
  const { data, isLoading, error } = useCustomHook(id);

  if (isLoading) return <Skeleton />;
  if (error) return <Error message={error.message} />;
  if (!data) return null;

  return (
    <div className={cn('p-4', className)}>
      {/* Render data */}
    </div>
  );
}
```

---

## 🧪 Template de Teste

```typescript
// components/features/[feature]/[ComponentName].test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from './ComponentName';

describe('[ComponentName]', () => {
  it('renders with title', () => {
    render(<ComponentName title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<ComponentName onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'new value');

    expect(handleChange).toHaveBeenCalledWith('new value');
  });

  it('applies custom className', () => {
    const { container } = render(
      <ComponentName title="Test" className="custom-class" />
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
```

---

## 📁 Organização por Feature

```
components/
├── ui/                          # Componentes base (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
│
├── features/                    # Componentes de features
│   ├── sessions/
│   │   ├── SessionTimer.tsx
│   │   ├── SessionCard.tsx
│   │   ├── SessionList.tsx
│   │   └── SessionTimer.test.tsx
│   │
│   ├── ranking/
│   │   ├── RankingTable.tsx
│   │   ├── RankingCard.tsx
│   │   └── RankingChart.tsx
│   │
│   └── feed/
│       ├── FeedItem.tsx
│       ├── FeedComment.tsx
│       └── FeedList.tsx
│
└── common/                      # Componentes comuns
    ├── Header.tsx
    ├── Navigation.tsx
    └── Footer.tsx
```

---

## ✅ Checklist Antes de Criar

- [ ] Componente tem um único propósito
- [ ] Nomes descritivos e em PascalCase
- [ ] Props interface bem definida
- [ ] JSDoc comentário explicando
- [ ] Arquivo no local correto
- [ ] Teste unitário criado
- [ ] Acessibilidade considerada
- [ ] Responsive (mobile-first)
- [ ] Sem console.log ou debugger
- [ ] Exportado em index.ts da pasta (se aplicável)

---

## 🔗 Referências

- Guia de Agentes: `.claude/AGENTS.md`
- ComponentDeveloper: `.claude/agents/component-developer.md`
