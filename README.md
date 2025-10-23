# Todo API

API RESTful para gerenciamento de tarefas (Todo List) construída com Node.js, Express, Prisma e Zod.

Esse projeto foi feito com o intuito de testar o Code Agent Claude

## 📋 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **Zod** - Validação de schemas
- **SQLite** - Banco de dados (pode ser facilmente trocado)

## 🏗️ Arquitetura

```
src/
├── config/          # Configurações (database)
├── controllers/     # Lógica de negócio
├── middlewares/     # Middlewares (validação, erros)
├── routes/          # Definição de rotas
├── validators/      # Schemas de validação Zod
├── app.js          # Configuração do Express
└── server.js       # Inicialização do servidor
```

## 🚀 Instalação

### Pré-requisitos

- Node.js 18+
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone <seu-repositorio>
cd todo-api
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Execute as migrações do banco de dados:
```bash
npm run prisma:migrate
```

5. Inicie o servidor:
```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 📚 Documentação da API

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Health Check
```
GET /api/health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-20T10:00:00.000Z",
  "uptime": 123.456
}
```

---

#### 2. Listar Todos
```
GET /api/todos
```

**Query Parameters:**
- `isDone` (opcional): `true` ou `false` - Filtrar por status
- `search` (opcional): string - Buscar no título ou descrição

**Exemplo:**
```bash
curl http://localhost:3000/api/todos?isDone=false&search=compras
```

**Resposta:**
```json
[
  {
    "id": 1,
    "title": "Comprar leite",
    "description": "Ir ao supermercado",
    "isDone": false,
    "reminder": "2024-01-20T15:00:00.000Z",
    "createdAt": "2024-01-20T10:00:00.000Z",
    "updatedAt": "2024-01-20T10:00:00.000Z"
  }
]
```

---

#### 3. Buscar Todo por ID
```
GET /api/todos/:id
```

**Exemplo:**
```bash
curl http://localhost:3000/api/todos/1
```

**Resposta:**
```json
{
  "id": 1,
  "title": "Comprar leite",
  "description": "Ir ao supermercado",
  "isDone": false,
  "reminder": "2024-01-20T15:00:00.000Z",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:00:00.000Z"
}
```

---

#### 4. Criar Todo
```
POST /api/todos
```

**Body:**
```json
{
  "title": "Comprar leite",
  "description": "Ir ao supermercado",
  "isDone": false,
  "reminder": "2024-01-20T15:00:00.000Z"
}
```

**Campos:**
- `title` (obrigatório): string (max 255)
- `description` (opcional): string (max 1000)
- `isDone` (opcional): boolean (default: false)
- `reminder` (opcional): ISO 8601 datetime string

**Exemplo:**
```bash
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Comprar leite",
    "description": "Ir ao supermercado",
    "reminder": "2024-01-20T15:00:00.000Z"
  }'
```

**Resposta:** (201 Created)
```json
{
  "id": 1,
  "title": "Comprar leite",
  "description": "Ir ao supermercado",
  "isDone": false,
  "reminder": "2024-01-20T15:00:00.000Z",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:00:00.000Z"
}
```

---

#### 5. Atualizar Todo
```
PUT /api/todos/:id
```

**Body:** (todos os campos são opcionais)
```json
{
  "title": "Comprar leite e pão",
  "description": "Ir ao supermercado depois do trabalho",
  "isDone": true,
  "reminder": "2024-01-20T18:00:00.000Z"
}
```

**Exemplo:**
```bash
curl -X PUT http://localhost:3000/api/todos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "isDone": true
  }'
```

**Resposta:**
```json
{
  "id": 1,
  "title": "Comprar leite",
  "description": "Ir ao supermercado",
  "isDone": true,
  "reminder": "2024-01-20T15:00:00.000Z",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:30:00.000Z"
}
```

---

#### 6. Alternar Status (Toggle)
```
PATCH /api/todos/:id/toggle
```

Alterna o status `isDone` do todo (true ↔ false)

**Exemplo:**
```bash
curl -X PATCH http://localhost:3000/api/todos/1/toggle
```

**Resposta:**
```json
{
  "id": 1,
  "title": "Comprar leite",
  "description": "Ir ao supermercado",
  "isDone": true,
  "reminder": "2024-01-20T15:00:00.000Z",
  "createdAt": "2024-01-20T10:00:00.000Z",
  "updatedAt": "2024-01-20T10:30:00.000Z"
}
```

---

#### 7. Deletar Todo
```
DELETE /api/todos/:id
```

**Exemplo:**
```bash
curl -X DELETE http://localhost:3000/api/todos/1
```

**Resposta:** (204 No Content)

---

### Tratamento de Erros

A API retorna erros no seguinte formato:

**Erro de Validação (400):**
```json
{
  "error": "Erro de validação",
  "details": [
    {
      "field": "title",
      "message": "O título é obrigatório"
    }
  ]
}
```

**Não Encontrado (404):**
```json
{
  "error": "Não encontrado",
  "message": "Todo não encontrado"
}
```

**Erro Interno (500):**
```json
{
  "error": "Erro interno do servidor"
}
```

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Produção
npm start

# Prisma
npm run prisma:migrate      # Executar migrações
npm run prisma:studio       # Interface visual do banco
npm run prisma:generate     # Gerar Prisma Client
```

## 📦 Modelo de Dados

```prisma
model Todo {
  id          Int       @id @default(autoincrement())
  title       String
  description String?
  isDone      Boolean   @default(false)
  reminder    DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

## 🔄 Integração com Flutter

O modelo desta API é compatível com o modelo Flutter fornecido:

```dart
class TodoModel {
  int? id;
  String title;
  bool isDone;
  DateTime? reminder;
  String? description;

  TodoModel({
    required this.title,
    this.description,
    this.isDone = false,
    this.id,
    this.reminder,
  });
}
```

## 🚀 Deploy

Para fazer deploy em produção:

1. Configure o banco de dados de produção (PostgreSQL, MySQL, etc.)
2. Atualize a `DATABASE_URL` no `.env`
3. Execute as migrações: `npm run prisma:migrate`
4. Inicie o servidor: `npm start`

## 📝 Licença

ISC
