# Todo API

API RESTful para gerenciamento de tarefas (Todo List) construída com Node.js, Express, Prisma e Zod em TypeScript.

## 📋 Tecnologias

- **TypeScript** - Superset JavaScript com tipagem estática
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **Zod** - Validação de schemas com inferência de tipos
- **SQLite** - Banco de dados (pode ser facilmente trocado)
- **tsx** - TypeScript executor para desenvolvimento

## 🏗️ Arquitetura

```
src/
├── config/          # Configurações (database)
├── controllers/     # Lógica de negócio com tipos inferidos
├── middlewares/     # Middlewares type-safe
├── routes/          # Definição de rotas
├── types/           # Tipos e interfaces TypeScript
├── validators/      # Schemas Zod + inferência de tipos
├── app.ts          # Configuração do Express
└── server.ts       # Inicialização do servidor
```

### Inferência de Tipos com Zod

A API aproveita o poder do Zod para gerar automaticamente tipos TypeScript a partir dos schemas de validação:

```typescript
// Schema Zod
export const createTodoSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(1000).optional().nullable(),
  isDone: z.boolean().default(false),
  reminder: z.string().datetime().optional().nullable(),
});

// Tipos TypeScript inferidos automaticamente
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
export type CreateTodoBody = z.input<typeof createTodoSchema>;
```

Isso garante que seus tipos TypeScript estejam sempre sincronizados com suas validações!

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
# Desenvolvimento (com watch mode)
npm run dev

# Build do TypeScript
npm run build

# Verificação de tipos
npm run type-check

# Produção (requer build primeiro)
npm run build && npm start

# Prisma
npm run prisma:migrate      # Executar migrações
npm run prisma:studio       # Interface visual do banco
npm run prisma:generate     # Gerar Prisma Client
```

## 💡 Exemplos de Uso com TypeScript

### Controllers com Tipos Inferidos

```typescript
import type { CreateTodoInput, TodoIdParams } from '../validators/todo.validator.js';

// Os tipos são automaticamente inferidos do Zod
create: AsyncRequestHandler = async (
  req: TypedRequest<CreateTodoInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // req.body é totalmente tipado!
  const { title, description, isDone, reminder } = req.body;

  const todo = await prisma.todo.create({
    data: { title, description, isDone, reminder: reminder ? new Date(reminder) : null }
  });

  res.status(201).json(todo);
};
```

### Validação Type-Safe

```typescript
// Middleware de validação com tipos genéricos
router.post(
  '/',
  validate(createTodoSchema),  // Valida e transforma os dados
  todoController.create        // Recebe dados já validados e tipados
);
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
