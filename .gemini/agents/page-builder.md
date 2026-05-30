---
name: PageBuilder
description: Especialista em criar páginas e rotas Next.js com App Router
applyTo: ["app/**/*.tsx", "app/**/page.tsx", "app/**/layout.tsx"]
---

# 📄 Agent: PageBuilder

**Especialista em estruturar páginas e rotas Next.js 16+ com App Router.**

---

## 🎯 Responsabilidades

- ✅ Criar páginas (`page.tsx`) seguindo App Router
- ✅ Implementar layouts (`layout.tsx`) sem prop drilling
- ✅ Proteger rotas com autenticação
- ✅ Configurar SEO (metadata)
- ✅ Lazy load componentes pesados
- ✅ Implementar error boundaries
- ✅ Estruturar loading states

---

## 📁 Estrutura de Rotas

### Organização
```
app/
├── layout.tsx              # Root layout (AuthProvider)
├── page.tsx                # Home / landing
├── (auth)/                 # Rotas públicas agrupadas
│   ├── layout.tsx
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (app)/                  # Rotas protegidas agrupadas
│   ├── layout.tsx          # Layout com header/nav
│   ├── dashboard/
│   │   └── page.tsx
│   ├── feed/
│   │   └── page.tsx
│   ├── ranking/
│   │   └── page.tsx
│   ├── lojinha/
│   │   └── page.tsx
│   └── sessions/
│       └── start/
│           └── page.tsx
└── api/                    # API routes (se necessário)
```

---

## 📋 Padrão de Página

### Página Básica
```typescript
// app/(app)/dashboard/page.tsx
import { Metadata } from 'next';
import { DashboardContent } from '@/components/features/dashboard';

export const metadata: Metadata = {
  title: 'Dashboard - Cagada Remunerada',
  description: 'Seu dashboard pessoal',
};

export default function DashboardPage() {
  return <DashboardContent />;
}
```

### Página com Server Component
```typescript
// app/(app)/ranking/page.tsx
import { Metadata } from 'next';
import { RankingList } from '@/components/features/ranking';
import { fetchRanking } from '@/lib/api/ranking';

export const metadata: Metadata = {
  title: 'Ranking - Cagada Remunerada',
};

export default async function RankingPage() {
  // Server component - pode fazer fetch direto
  const ranking = await fetchRanking();

  return <RankingList data={ranking} />;
}
```

### Página com Dynamic Route
```typescript
// app/(app)/sessions/[id]/page.tsx
import { Metadata } from 'next';
import { SessionDetail } from '@/components/features/sessions';
import { fetchSession } from '@/lib/api/sessions';

interface SessionPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SessionPageProps): Promise<Metadata> {
  const session = await fetchSession(params.id);
  
  return {
    title: `Sessão ${session.id} - Cagada Remunerada`,
    description: `Sessão de ${session.duration_seconds}s`,
  };
}

export default async function SessionPage({ params }: SessionPageProps) {
  const session = await fetchSession(params.id);
  return <SessionDetail session={session} />;
}
```

---

## 🛡️ Autenticação em Rotas

### Layout de Rotas Protegidas
```typescript
// app/(app)/layout.tsx
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { Header } from '@/components/header';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={session.user} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
```

### Layout de Rotas Públicas
```typescript
// app/(auth)/layout.tsx
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
```

---

## ⚡ Lazy Loading Componentes

```typescript
'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load componente pesado
const HeavyChart = dynamic(
  () => import('@/components/features/chart').then(mod => mod.Chart),
  {
    loading: () => <Skeleton className="w-full h-96" />,
    ssr: false, // Se realmente não precisa de SSR
  }
);

export function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart />
    </div>
  );
}
```

---

## 🐛 Error Boundary

```typescript
// app/(app)/error.tsx
'use client';

import { useEffect } from 'react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-xl font-bold mb-4">Algo deu errado</h2>
      <button
        onClick={reset}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Tentar novamente
      </button>
    </div>
  );
}
```

---

## ⏳ Loading State

```typescript
// app/(app)/loading.tsx
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
```

---

## 📝 Metadata & SEO

### Static Metadata
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minha Página',
  description: 'Descrição para SEO',
  keywords: ['keyword1', 'keyword2'],
  openGraph: {
    title: 'Minha Página',
    description: 'Descrição OG',
    url: 'https://codecon.com',
    images: [
      {
        url: 'https://codecon.com/og-image.png',
      },
    ],
  },
};
```

### Dynamic Metadata (Route Params)
```typescript
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await fetchUser(params.id);
  
  return {
    title: user.name,
    description: `Perfil de ${user.name}`,
  };
}
```

---

## ✅ Checklist

- [ ] Rota criada em estrutura correta (`(app)` ou `(auth)`)
- [ ] Página tem `metadata` export
- [ ] Autenticação verificada se rota protegida
- [ ] Componentes pesados usar lazy loading
- [ ] Error boundary implementada
- [ ] Loading state definido
- [ ] Responsiva (mobile-first)
- [ ] Sem console.log ou debugger
- [ ] Types definidas para params se necessário
- [ ] Testada em dev

---

## 🔗 Relacionados

- Auth: `lib/auth.tsx`
- API: `lib/api/`
- Components: `components/features/`
- Types: `types/`

---

## 📚 Referências

- [Next.js App Router](https://nextjs.org/docs/app)
- [Metadata API](https://nextjs.org/docs/app/api-reference/functions/metadata)
- [Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
