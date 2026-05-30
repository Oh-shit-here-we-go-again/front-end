# 🎯 .claude - AI Configuration

Direcionamento e configuração para a IA trabalhar de forma otimizada no projeto front-end.

---

## 📁 Estrutura

```
.claude/
├── README.md                      # Este arquivo
├── copilot-instructions.md        # Instruções gerais do projeto
├── AGENTS.md                      # Lista de agentes disponíveis
├── SKILLS.md                      # Lista de skills disponíveis
├── agents/                        # Agentes especializados
│   ├── component-developer.md     # Criação de componentes
│   ├── page-builder.md            # Páginas e rotas Next.js
│   ├── typescript-architect.md    # Types e interfaces
│   ├── api-integration.md         # Integração com backend
│   ├── style-specialist.md        # Design e Tailwind
│   └── performance-optimizer.md   # Performance e otimização
└── skills/                        # Padrões reutilizáveis
    ├── component-structure.md     # Templates de componentes
    ├── type-safety.md             # Padrões TypeScript
    └── testing-patterns.md        # Padrões de testes
```

---

## 🚀 Quick Start

### Para Desenvolvedores
1. Leia `copilot-instructions.md` para princípios gerais
2. Consulte `AGENTS.md` para qual agente usar
3. Use skills para padrões específicos

### Para a IA (Copilot)
1. **Sempre** respeite `copilot-instructions.md`
2. **Use agentes** para tarefas especializadas
3. **Refira skills** para padrões consistentes
4. **Valide** contra checklists em cada agente/skill

---

## 🤖 Agentes Disponíveis

| Agente | Foco | Usar quando |
|--------|------|-----------|
| **ComponentDeveloper** | React components | Criando/refatorando componentes |
| **PageBuilder** | Next.js pages/rotas | Criando páginas e rotas |
| **TypeScriptArchitect** | Types & interfaces | Definindo tipos para features |
| **APIIntegration** | Backend integration | Conectando com Django API |
| **StyleSpecialist** | Design & animations | Estilizando e animando |
| **PerformanceOptimizer** | Performance | Analisando e otimizando |

**Leia:** [AGENTS.md](./AGENTS.md)

---

## 🎓 Skills Disponíveis

| Skill | Descrição | Inclui |
|-------|-----------|--------|
| **component-structure** | Templates de componentes | 4 templates + org |
| **type-safety** | Padrões TypeScript | Estratégias + examples |
| **testing-patterns** | Padrões de testes | Setup + tests |

**Leia:** [SKILLS.md](./SKILLS.md)

---

## ✅ Checklist para Tarefas

### Criar Novo Componente
- [ ] Use skill `component-structure`
- [ ] Valide types com skill `type-safety`
- [ ] Escreva testes com skill `testing-patterns`
- [ ] Siga checklist do agente ComponentDeveloper

### Integrar com Backend
- [ ] Consulte agente APIIntegration
- [ ] Defina types com TypeScriptArchitect
- [ ] Valide respostas com Zod
- [ ] Teste com MSW

### Criar Página
- [ ] Use agente PageBuilder
- [ ] Considere lazy loading
- [ ] Implemente autenticação se necessário
- [ ] Optimize com PerformanceOptimizer

---

## 📖 Convenções Importantes

### Padrão de Respostas
- ✅ Direto, sem explicações desnecessárias
- ✅ Implementar, não apenas sugerir
- ✅ Valide contra checklists
- ✅ Cite agent/skill usado

### Type Safety
- ✅ **ZERO** `any` types sem justificativa
- ✅ Sempre validar inputs com Zod
- ✅ Use discriminated unions para estados
- ✅ Props bem tipadas

### Código
- ✅ PascalCase para componentes
- ✅ camelCase para funções
- ✅ SCREAMING_SNAKE_CASE para constantes
- ✅ Máximo 300 linhas por componente

### Testes
- ✅ Teste comportamento, não implementação
- ✅ Use `getByRole` quando possível
- ✅ Mire por >= 80% cobertura
- ✅ Testes devem ser legíveis

---

## 🔄 Exemplo de Workflow

### Criar SessionTimer Component
1. **Planejamento**: Qual agente? → ComponentDeveloper
2. **Types**: Use TypeScriptArchitect → skill type-safety
3. **Estrutura**: Use skill component-structure
4. **Desenvolvimento**: ComponentDeveloper + StyleSpecialist
5. **Testes**: skill testing-patterns
6. **Performance**: PerformanceOptimizer se necessário
7. **Review**: Contra checklists

---

## 🎯 Princípios

### Qualidade Acima de Velocidade
- Testes escritos primeiro (ou junto com código)
- Type safety garantida
- Code review antes de merge
- Performance considerada

### Consistência
- Padrões são seguidos rigidamente
- Estrutura respeitada
- Convenções mantidas
- Templates usados como base

### Documentação
- Código autodocumentado com types
- JSDoc para funções públicas
- Exemplos em cada arquivo
- Skills e agents bem explicados

---

## 📞 Quando Consultar

| Dúvida | Consulte |
|--------|----------|
| Como criar componente? | skill `component-structure` + agent ComponentDeveloper |
| Como tipar função? | agent TypeScriptArchitect + skill `type-safety` |
| Como testar? | skill `testing-patterns` |
| Como chamar API? | agent APIIntegration |
| Como estilizar? | agent StyleSpecialist |
| Performance? | agent PerformanceOptimizer |
| Instruções gerais? | `copilot-instructions.md` |

---

## 🚫 Anti-patterns

```typescript
// ❌ NÃO FAÇA
- Usar `any` type
- Componentes > 300 linhas
- Sem testes
- Hardcoded strings/values
- Console.log em produção
- Ignorar type errors
- CSS inline
- Props não tipadas

// ✅ FAÇA
- Type everything
- Componentes pequenos
- Testes desde início
- Constantes
- Logs estruturados
- Fix type errors
- Tailwind CSS
- JSDoc comments
```

---

## 📚 Recursos Internos

- [Instruções Gerais](./copilot-instructions.md)
- [Agentes](./AGENTS.md)
- [Skills](./SKILLS.md)
- [API Backend](../../docs/backend/api.md)

---

## 🔧 Manutenção

### Atualizar Agent
Edite arquivo em `agents/[name].md` e valide contra checklist.

### Adicionar Skill
1. Crie arquivo em `skills/[name].md`
2. Adicione referência em `SKILLS.md`
3. Documente bem com exemplos

### Atualizar Instruções
Edite `copilot-instructions.md` se convenções mudam.

---

**Última atualização:** 30 de maio de 2026

**Criado para:** Projeto Codecon (Cagada Remunerada)

**Versão:** 1.0
