# Cagada Remunerada — Front-end

> Interface do sistema que prova, em pixels, que você está sendo pago para cagar.

Frontend em Next.js (App Router) que consome a API do shitgo. Autenticação JWT, feed social, ranking, famílias de competição, lojinha de avatares e sessões com timer.

---

## Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript 5 |
| Estilo | Tailwind CSS 4 |
| Componentes | shadcn/ui + Radix UI |
| Animações | Motion (Framer) |
| Gráficos | Recharts |
| Forms/validação | Zod |
| Ícones | Lucide + HugeIcons |
| Notificações | Sonner |

---

## Primeiros passos

```bash
# 1. Instale as dependências
npm install

# 2. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com a URL da API

# 3. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

---

## Comandos

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run start    # Serve build de produção
npm run lint     # Roda o ESLint
```

---

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Landing page |
| `/login` | Autenticação |
| `/register` | Cadastro |
| `/dashboard` | Painel pessoal com histórico e earnings |
| `/sessions/start` | Iniciar nova sessão (timer) |
| `/feed` | Feed público de sessões |
| `/trono` | Ranking global |
| `/families` | Lista de famílias de competição |
| `/family/[id]` | Detalhe de uma família |
| `/profile` | Perfil do usuário |
| `/lojinha` | Loja de avatares com cocôins |

---

## Estrutura do projeto

```
front-end/
├── app/
│   ├── (app)/          # Rotas autenticadas
│   ├── (auth)/         # Login e cadastro
│   ├── layout.tsx
│   └── page.tsx        # Landing
├── features/           # Lógica por domínio (dashboard, shop)
├── services/           # Chamadas à API REST
├── components/         # Componentes reutilizáveis
├── hooks/              # Custom hooks
├── types/              # Tipos TypeScript
├── lib/                # Utilitários
└── public/             # Assets estáticos
```
