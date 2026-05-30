# 🤖 Agentes Disponíveis - Codecon Frontend

Este arquivo lista todos os agentes customizados disponíveis para trabalhar no projeto. Cada agente tem um propósito específico e segue certas convenções.

---

## 📋 Agentes

### 1. **ComponentDeveloper** (`agents/component-developer.md`)
**Especialista em criação e refatoração de componentes React**

**Quando usar:**
- Criar novo componente
- Refatorar componente existente
- Otimizar performance de componente
- Resolver bugs em componentes

**Responsabilidades:**
- Garantir type safety total
- Seguir padrão de estrutura
- Implementar acessibilidade
- Escrever testes unitários

---

### 2. **PageBuilder** (`agents/page-builder.md`)
**Especialista em criar páginas e rotas Next.js**

**Quando usar:**
- Criar nova página/rota
- Integrar layout com páginas
- Configurar autenticação de rotas
- Estruturar página complexa

**Responsabilidades:**
- Respeitar App Router do Next.js
- Implementar autenticação
- Otimizar SEO onde aplicável
- Lazy load componentes

---

### 3. **TypeScriptArchitect** (`agents/typescript-architect.md`)
**Especialista em types, interfaces e segurança de tipos**

**Quando usar:**
- Definir tipos/interfaces de novo feature
- Refatorar types existentes
- Resolver type errors
- Implementar discriminated unions

**Responsabilidades:**
- Zero `any` types
- Types bem documentados
- DRY (reuse types)
- Validação em runtime com Zod

---

### 4. **APIIntegration** (`agents/api-integration.md`)
**Especialista em integração com backend Django**

**Quando usar:**
- Conectar frontend com novo endpoint
- Criar cliente HTTP reutilizável
- Implementar autenticação JWT
- Tratar erros de API

**Responsabilidades:**
- Seguir padrão de requisições
- Type-safe API calls
- Retry logic e timeout
- Error handling robusto

---

### 5. **StyleSpecialist** (`agents/style-specialist.md`)
**Especialista em design, Tailwind CSS e animações**

**Quando usar:**
- Estilizar novo componente
- Implementar design responsivo
- Criar animações com Framer Motion
- Garantir acessibilidade visual

**Responsabilidades:**
- Usar apenas Tailwind classes
- Mobile-first approach
- Validar contraste (WCAG AA)
- Smooth transitions

---

### 6. **PerformanceOptimizer** (`agents/performance-optimizer.md`)
**Especialista em otimização e performance**

**Quando usar:**
- Analisar e melhorar performance
- Reduzir bundle size
- Otimizar renders e re-renders
- Implementar lazy loading

**Responsabilidades:**
- Profiling com DevTools
- Implementar memoization onde faz sentido
- Code splitting automático
- Monitoring de metrics

---

## 🎯 Como Usar os Agentes

### Ativação Explícita
Mencione o agente no seu prompt:
```
"@ComponentDeveloper: Crie um componente SessionCard que..."
```

### Recomendações Automáticas
Os agentes são recomendados automaticamente baseado no contexto:
- Criando arquivo em `components/` → ComponentDeveloper
- Criando arquivo em `app/` → PageBuilder
- Editando `types/` → TypeScriptArchitect
- Editando arquivo com fetch → APIIntegration

---

## 🔄 Fluxo de Trabalho Sugerido

### Para Feature Completa
1. **TypeScriptArchitect** → Defina types/interfaces
2. **APIIntegration** → Implemente conexão com API
3. **ComponentDeveloper** → Crie componentes
4. **StyleSpecialist** → Estilize e revise acessibilidade
5. **PerformanceOptimizer** → Otimize se necessário
6. **PageBuilder** → Integre em página

---

## ⚙️ Configuração de Agentes

Cada agente tem um arquivo `.md` em `agents/` com:
- Instruções detalhadas
- Checklist de responsabilidades
- Exemplos de padrões
- Referências e links

---

## 📝 Notas

- **Agents não são exclusivos**: Você pode chamar múltiplos agentes
- **Context importa**: Sempre forneça contexto suficiente
- **Combine skills**: Use skills junto com agents para melhor resultado
- **Feedback**: Se um agente falhar, descreva o problema

---

## 🔗 Relacionados

- Ver skills em `skills/`
- Ver instruções gerais em `copilot-instructions.md`
- Documentação principal em `../../docs/`
