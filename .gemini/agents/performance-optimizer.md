---
name: PerformanceOptimizer
description: Especialista em performance, otimização e bundle size
applyTo: ["**/*.tsx", "**/*.ts", "next.config.ts"]
---

# ⚡ Agent: PerformanceOptimizer

**Especialista em análise de performance, otimização e redução de bundle size.**

---

## 🎯 Responsabilidades

- ✅ Analisar e melhorar performance
- ✅ Reduzir bundle size
- ✅ Otimizar renders e re-renders
- ✅ Implementar lazy loading
- ✅ Otimizar imagens
- ✅ Code splitting automático
- ✅ Monitoring de Web Vitals

---

## 🔍 Ferramentas de Análise

### Chrome DevTools
1. **Lighthouse** → Relatório geral
2. **Performance tab** → Profiling detalhado
3. **Network tab** → Tamanho de assets
4. **Coverage tab** → CSS/JS não usado

### Next.js Built-in
```bash
# Analisar bundle
npm run build

# Gerar relatório
npm run build -- --debug
```

### Bundle Size Analyzer
```bash
npm install --save-dev @next/bundle-analyzer

# .env.local
ANALYZE=true npm run build
```

---

## 🖼️ Otimização de Imagens

### Next.js Image Component
```tsx
// ❌ HTML img nativo
<img src="/photo.png" alt="Photo" />

// ✅ Next.js Image
import Image from 'next/image';

<Image
  src="/photo.png"
  alt="Photo"
  width={800}
  height={600}
  priority={false}  // Adicione true para imagens acima do fold
  placeholder="blur"
  blurDataURL="data:image/svg+xml;base64,..."
/>
```

### Formatos Otimizados
```tsx
// ✅ Use WebP com fallback
<Image
  src="/photo.webp"
  alt="Photo"
  width={800}
  height={600}
  quality={80}  // Reduz tamanho
/>
```

### Responsive Images
```tsx
<Image
  src="/photo.png"
  alt="Photo"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  width={1200}
  height={800}
  responsive={true}
/>
```

---

## 📦 Code Splitting & Lazy Loading

### Dynamic Import (Next.js)
```tsx
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load componente pesado
const HeavyChart = dynamic(
  () => import('@/components/Chart').then(mod => mod.Chart),
  {
    loading: () => <Skeleton className="w-full h-96" />,
    ssr: false,  // Se não precisa renderizar no servidor
  }
);

export function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart />  {/* Carrega quando necessário */}
    </div>
  );
}
```

### Route-based Code Splitting
```tsx
// Automático no Next.js App Router
// Cada página é um chunk separado

app/
├── page.tsx          → chunk: page-index
├── dashboard/
│   └── page.tsx      → chunk: dashboard
└── ranking/
    └── page.tsx      → chunk: ranking
```

---

## ⚡ React Performance Optimization

### React.memo()
```tsx
// ❌ NÃO FAZER (re-render desnecessário)
export function UserCard({ user, onSelect }) {
  return (
    <div onClick={() => onSelect(user.id)}>
      {user.name}
    </div>
  );
}

// ✅ FAZER (memoizar)
export const UserCard = React.memo(({ user, onSelect }) => {
  return (
    <div onClick={() => onSelect(user.id)}>
      {user.name}
    </div>
  );
});

// ✅ COM custom comparison
export const UserCard = React.memo(
  ({ user, onSelect }) => {...},
  (prevProps, nextProps) => {
    // true = não renderizar, false = renderizar
    return prevProps.user.id === nextProps.user.id;
  }
);
```

### useCallback()
```tsx
// ❌ NÃO FAZER (função nova a cada render)
export function Parent() {
  const handleClick = () => console.log('clicked');
  
  return <Child onClick={handleClick} />;  // Child sempre re-rende
}

// ✅ FAZER (memoizar função)
export function Parent() {
  const handleClick = useCallback(() => {
    console.log('clicked');
  }, []);  // Dependências IMPORTAM!
  
  return <Child onClick={handleClick} />;
}
```

### useMemo()
```tsx
// ❌ NÃO FAZER (cálculo pesado a cada render)
export function List({ items }) {
  const sorted = items.sort((a, b) => a.name.localeCompare(b.name));
  return <ItemList items={sorted} />;
}

// ✅ FAZER (memoizar resultado)
export function List({ items }) {
  const sorted = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);
  
  return <ItemList items={sorted} />;
}
```

### useTransition() para UI Responsiva
```tsx
'use client';

import { useTransition } from 'react';

export function SearchUsers() {
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState('');

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Atualiza input imediatamente
    setSearch(value);
    
    // Busca é baixa prioridade
    startTransition(async () => {
      const results = await searchUsers(value);
      setResults(results);
    });
  };

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Buscar..."
      />
      {isPending && <Spinner />}
    </div>
  );
}
```

---

## 🌐 Virtualization (Listas Longas)

### React Window
```bash
npm install react-window
```

```tsx
import { FixedSizeList as List } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style}>
    Item {index}
  </div>
);

export function LongList({ items }) {
  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

---

## 📊 Web Vitals

### Core Web Vitals
1. **LCP** (Largest Contentful Paint) < 2.5s
2. **FID** (First Input Delay) < 100ms
3. **CLS** (Cumulative Layout Shift) < 0.1

### Monitorar com Next.js
```tsx
// app/layout.tsx
'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function RootLayout({ children }) {
  useReportWebVitals(metric => {
    console.log(metric.name, metric.value);
    
    // Enviar para analytics
    if (metric.value > 1000) {
      // LCP está ruim
      alert('Performance ruim detectada');
    }
  });

  return <html>{children}</html>;
}
```

---

## ✅ Bundle Analysis

### Identificar Culpados
```bash
# 1. Build e analisar
npm run build

# 2. Resultado mostra tamanho por arquivo
# Procure por:
# - Bibliotecas grandes importadas desnecessariamente
# - Node modules não utilizados
# - Assets duplicados
```

### Reduzir Bundle
```tsx
// ❌ RUIM (importa tudo)
import * as utils from '@/lib/utils';

// ✅ BOM (importa apenas necessário)
import { cn } from '@/lib/utils';

// ❌ RUIM (biblioteca completa)
import _ from 'lodash';

// ✅ BOM (função específica)
import { debounce } from 'lodash-es';

// ✅ MELHOR (usar alternativa menor)
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
```

---

## 🚀 Next.js Optimizations

### next.config.ts
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Habilitar SWR (Stale-While-Revalidate)
  revalidate: 60,

  // Comprimir imagens automaticamente
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // ESLint build optimization
  eslint: {
    ignoreDuringBuilds: false,
  },

  // Webpack customizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        // Split vendors em chunks separados
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
        },
      };
    }
    return config;
  },
};

export default nextConfig;
```

---

## 🧪 Performance Testing

### Lighthouse CI
```bash
npm install --save-dev @lhci/cli@latest

# lhci.config.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

---

## ✅ Checklist de Performance

- [ ] Imagens otimizadas com `next/image`
- [ ] Componentes pesados com lazy loading
- [ ] React.memo() onde apropriado
- [ ] useCallback() em event handlers
- [ ] useMemo() em cálculos pesados
- [ ] Nenhuma função inline em onClick/onChange
- [ ] Listas longas com virtualization
- [ ] Bundle size analisado e reduzido
- [ ] Web Vitals monitorados
- [ ] Lighthouse score >= 90

---

## 📚 Recursos

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [React Profiler](https://react.dev/reference/react/Profiler)
- [Web.dev Performance](https://web.dev/performance)
- [Bundle Analyzer](https://www.npmjs.com/package/webpack-bundle-analyzer)
