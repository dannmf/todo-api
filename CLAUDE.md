# CLAUDE.md

Esteprojeto é onde iremos trabalhar juntos, você vai ficar me dando instruões e explicando a cada uma do por que estamos fazendo aquilo, eu vou codar e o seu papel é instruir.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos de Desenvolvimento

### Scripts Básicos
- `npm run dev` - Executa o servidor em modo de desenvolvimento com nodemon
- `npm run build` - Compila TypeScript para JavaScript (saida em ./dist)
- `npm start` - Executa o servidor em produção (dist/server.js)
- `npm run lint` - Executa ESLint nos arquivos TypeScript
- `npm run lint:fix` - Executa ESLint e corrige problemas automaticamente
- `npm run type-check` - Verifica tipos TypeScript sem compilar

### Comandos Prisma
- `npx prisma generate` - Gera o cliente Prisma (saida em src/generated/prisma)
- `npx prisma db push` - Aplica mudanças do schema ao banco SQLite
- `npx prisma migrate dev` - Cria e aplica nova migração
- `npx prisma studio` - Interface gráfica para visualizar dados

## Arquitetura do Projeto

### Estrutura de Arquivos
```
src/
├── server.ts          # Entry point do servidor
├── app.ts             # Configuração do Express com middlewares
├── utils/
│   └── prisma.ts      # Singleton do cliente Prisma
└── schemas/
    ├── todo.schema.ts # Schemas de validação Zod
    └── todo.types.ts  # Tipos TypeScript derivados dos schemas
```

### Tecnologias Utilizadas
- **Express 5** - Framework web
- **TypeScript** - Linguagem principal
- **Prisma** - ORM com SQLite como banco de dados
- **Zod** - Validação de schemas e geração de tipos
- **Helmet** - Middlewares de segurança
- **CORS** - Habilitação de cross-origin requests

### Modelo de Dados
O projeto tem um único modelo `Todo` com:
- `id` (String, CUID)
- `title` (String, obrigatório)
- `description` (String, opcional)
- `isCompleted` (Boolean, padrão false)
- `reminder` (DateTime, opcional)
- `createdAt` (DateTime, automático)
- `updatedAt` (DateTime, automático)

### Configurações Importantes
- Cliente Prisma é gerado em `src/generated/prisma/` (ignorado no git)
- Database SQLite em `prisma/dev.db`
- Build TypeScript compila para `./dist`
- Logs de requisições são habilitados por padrão
- Middleware de erro global configurado com diferentes mensagens para dev/prod