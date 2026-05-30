# 🎓 Skills Disponíveis - Codecon Frontend

Coleção de padrões, templates e boas práticas reutilizáveis para o projeto.

---

## 📚 Skills

### 1. **component-structure** (`skills/component-structure.md`)
**Templates e padrões para criar componentes React**

Inclui:
- Template básico de componente
- Template com estado
- Template com hooks customizados
- Template de testes
- Organização de pastas por feature
- Checklist de qualidade

**Quando usar:**
- Criando novo componente
- Seguir padrão do projeto
- Refatorar componentes existentes

---

### 2. **type-safety** (`skills/type-safety.md`)
**Padrões para 100% type safety em TypeScript**

Inclui:
- Zero tolerância para `any`
- Type inference
- Discriminated unions
- Validação com Zod
- Generics para reutilização
- Utility types
- Event handler typing

**Quando usar:**
- Definindo types para novos features
- Resolvendo type errors
- Melhorando segurança de tipos
- Type review

---

### 3. **testing-patterns** (`skills/testing-patterns.md`)
**Padrões para testes de componentes, hooks e funções**

Inclui:
- Setup de Vitest e Testing Library
- Testes de componentes simples/com estado
- Testes de hooks customizados
- Testes de funções utilitárias
- Mock API com MSW
- Cobertura de testes
- Anti-patterns

**Quando usar:**
- Escrevendo testes para componentes
- Testando novo behavior
- Aumentar cobertura de testes
- Code review de testes

---

## 🔄 Como Usar Skills

### Referência Direta
Dentro de um contexto, você pode referir-se a uma skill:
```
@ComponentDeveloper usar skill component-structure para nova página
```

### Busca Semântica
Skills são automaticamente sugeridas baseado no contexto:
- Criando componente → `component-structure`
- Definindo types → `type-safety`
- Escrevendo testes → `testing-patterns`

---

## 🧩 Combinações Úteis

### Feature Completa
1. **type-safety** → Defina types/interfaces
2. **component-structure** → Crie componentes
3. **testing-patterns** → Escreva testes
4. Combine com agentes apropriados

### Refatoração
1. **type-safety** → Review types
2. **component-structure** → Melhore estrutura
3. **testing-patterns** → Valide com testes

---

## 📝 Sugestões

### Skills Futuras a Criar
- [ ] `api-integration-patterns` - Padrões de requisições
- [ ] `state-management` - Gerenciamento de estado (Context, etc)
- [ ] `form-patterns` - Padrões para formulários
- [ ] `error-handling` - Tratamento de erros
- [ ] `animation-patterns` - Padrões com Framer Motion
- [ ] `accessibility-checklist` - Acessibilidade Web

---

## 🔗 Relacionados

- Agentes: `AGENTS.md`
- Instruções gerais: `copilot-instructions.md`
