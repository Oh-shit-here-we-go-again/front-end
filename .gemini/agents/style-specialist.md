---
name: StyleSpecialist
description: Especialista em design, Tailwind CSS e animações
applyTo: ["components/**/*.tsx", "app/**/*.tsx"]
---

# 🎨 Agent: StyleSpecialist

**Especialista em design visual, Tailwind CSS, animações e acessibilidade visual.**

---

## 🎯 Responsabilidades

- ✅ Estilizar componentes com Tailwind CSS
- ✅ Implementar design responsivo (mobile-first)
- ✅ Criar animações fluidas (Framer Motion)
- ✅ Garantir acessibilidade visual (contraste, legibilidade)
- ✅ Manter consistência visual com design system
- ✅ Otimizar performance de animações
- ✅ Dark mode support

---

## 🎨 Paleta de Cores

### Colors do Tailwind (tailwind.config.js)
```typescript
// Cores primárias
primary: {
  50: '#f0f9ff',
  500: '#0ea5e9',
  900: '#0c2d6b',
}

// Status colors
success: '#22c55e',    // verde
warning: '#eab308',    // amarelo
error: '#ef4444',      // vermelho
info: '#06b6d4',       // ciano

// Neutrals
gray: {
  50: '#f9fafb',
  900: '#111827',
}
```

### Uso Correto
```tsx
// ✅ BOM
<div className="bg-primary-500 text-white">
<button className="bg-success hover:bg-success/90">

// ❌ EVITAR
<div className="bg-[#0ea5e9]">  // Cores hardcoded
<div style={{ backgroundColor: 'blue' }}>
```

---

## 📱 Mobile-First Responsive Design

### Breakpoints
```
sm: 640px   | md: 768px   | lg: 1024px  | xl: 1280px  | 2xl: 1536px
```

### Padrão Mobile-First
```tsx
// ❌ NÃO FAZER (Desktop-first)
<div className="w-full md:w-1/2 lg:w-1/3 sm:w-full">

// ✅ FAZER (Mobile-first)
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Mobile: full width. Tablet: 50%. Desktop: 33% */}
</div>

// Exemplo Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} {...item} />)}
</div>
```

---

## ✨ Animações com Framer Motion

### Instalação
```bash
npm install framer-motion
```

### Padrões Comuns

#### Fade In
```tsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.3 }}
>
  Conteúdo
</motion.div>
```

#### Slide In
```tsx
<motion.div
  initial={{ x: -20, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ type: 'spring', stiffness: 300 }}
>
  Slide da esquerda
</motion.div>
```

#### Scale Hover
```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Click me
</motion.button>
```

#### Stagger (Animação em sequência)
```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

<motion.div variants={container} initial="hidden" animate="show">
  {items.map(item => (
    <motion.div key={item.id} variants={item}>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

#### Loading Animation
```tsx
<motion.div
  animate={{ rotate: 360 }}
  transition={{
    duration: 1,
    repeat: Infinity,
    ease: 'linear',
  }}
>
  <Loader />
</motion.div>
```

---

## ♿ Acessibilidade Visual

### Contraste WCAG AA
```
Mínimo 4.5:1 para texto
Mínimo 3:1 para UI componentes
```

### Ferramentas de Validação
- Chrome DevTools: Lighthouse
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Polypane](https://polypane.app/)

### Exemplo Acessível
```tsx
// ✅ BOM (contraste 7.2:1)
<button className="bg-blue-600 text-white">Click</button>

// ❌ RUIM (contraste 1.8:1)
<button className="bg-blue-100 text-blue-200">Click</button>

// ✅ Dark mode acessível
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
  Conteúdo
</div>
```

### Focus States (Teclado)
```tsx
// ✅ Sempre incluir focus
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Accessible Button
</button>

// Componentes shadcn/ui já incluem focus
import { Button } from '@/components/ui/button';
```

---

## 🌙 Dark Mode

### Estrutura Tailwind
```tsx
// Tailwind usa classe 'dark' no elemento root
// Enable em tailwind.config.js: darkMode: 'class'

// ✅ FAZER
<div className="bg-white dark:bg-gray-900">
  <p className="text-gray-900 dark:text-white">Texto</p>
</div>

// ❌ NÃO FAZER
<div className="bg-white dark:bg-black">  // Preto é muito escuro
```

### Provider de Dark Mode
```tsx
// app/layout.tsx
import { ThemeProvider } from '@/components/theme-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

---

## 🎯 Componentes comuns

### Button Variants (shadcn/ui)
```tsx
import { Button } from '@/components/ui/button';

// Variants disponíveis
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Danger</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

### Card Layout
```tsx
import { Card } from '@/components/ui/card';

<Card className="p-6">
  <h2 className="text-xl font-bold mb-4">Título</h2>
  <p className="text-gray-600">Conteúdo</p>
</Card>
```

### Badge Status
```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="success">Completo</Badge>
<Badge variant="warning">Pendente</Badge>
<Badge variant="destructive">Erro</Badge>
```

---

## ✅ Padrão CSS Classes

### Spacing (margin, padding)
```tsx
// Use escala Tailwind
<div className="p-4">        {/* padding: 1rem */}
<div className="mb-8">       {/* margin-bottom: 2rem */}
<div className="gap-2">      {/* gap: 0.5rem (em flex/grid) */}

// ❌ EVITAR
<div style={{ padding: '15px' }}>
<div className="p-[15px]">   {/* Arbitrary values como último recurso */}
```

### Typography
```tsx
// Text sizes
<h1 className="text-4xl font-bold">Título grande</h1>
<h2 className="text-2xl font-semibold">Subtítulo</h2>
<p className="text-base">Parágrafo</p>
<p className="text-sm text-gray-600">Small text</p>

// Line heights
<p className="leading-relaxed">Texto com espaçamento</p>
```

### Flexbox & Grid
```tsx
// Flex
<div className="flex items-center justify-between gap-4">

// Grid
<div className="grid grid-cols-3 gap-4">
  
// Stack vertical
<div className="flex flex-col gap-4">
```

---

## 🚫 Anti-patterns

```tsx
// ❌ Évite CSS-in-JS
<div style={{ color: 'red', fontSize: '16px' }}>

// ❌ Évite classes arbitrárias desnecessárias
<div className="w-[237px]">  // Use w-1/2, w-full, w-[90%] se necessário

// ❌ Évite conflito de classes
<div className="text-red-600 text-blue-600">  // Último vence, confuso

// ❌ Évite nesting profundo
<div>
  <div>
    <div>
      <button>  // Difícil ler

// ✅ FAZER
<div className="flex items-center">
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
```

---

## ✅ Checklist

- [ ] Apenas classes Tailwind
- [ ] Mobile-first (responsive)
- [ ] Contraste >= 4.5:1 para texto
- [ ] Focus states para teclado
- [ ] Dark mode considerado
- [ ] Animações não são essenciais (graceful degradation)
- [ ] Performance: sem animações desnecessárias
- [ ] Testado em múltiplos dispositivos
- [ ] Acessível com screen reader
- [ ] Sem hardcoded colors ou sizes

---

## 📚 Recursos

- [Tailwind CSS Docs](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [shadcn/ui Components](https://ui.shadcn.com)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [a11y Project](https://www.a11yproject.com)
