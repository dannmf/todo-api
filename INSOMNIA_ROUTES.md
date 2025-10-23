# Rotas da API - Insomnia

Base URL: `http://localhost:3000`

## 1. Health Check
**GET** `http://localhost:3000/api/health`

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-23T10:30:00.000Z",
  "uptime": 123.456
}
```

---

## 2. Listar Todos
**GET** `http://localhost:3000/api/todos`

**Query Params (opcionais):**
- `isDone=true` ou `isDone=false`
- `search=texto`

**Exemplos:**
- `http://localhost:3000/api/todos`
- `http://localhost:3000/api/todos?isDone=false`
- `http://localhost:3000/api/todos?search=comprar`
- `http://localhost:3000/api/todos?isDone=true&search=estudar`

**Response:**
```json
[
  {
    "id": 1,
    "title": "Comprar leite",
    "description": "Ir ao mercado",
    "isDone": false,
    "reminder": "2025-10-24T10:00:00.000Z",
    "createdAt": "2025-10-23T10:00:00.000Z",
    "updatedAt": "2025-10-23T10:00:00.000Z"
  }
]
```

---

## 3. Buscar Todo por ID
**GET** `http://localhost:3000/api/todos/1`

**Response:**
```json
{
  "id": 1,
  "title": "Comprar leite",
  "description": "Ir ao mercado",
  "isDone": false,
  "reminder": "2025-10-24T10:00:00.000Z",
  "createdAt": "2025-10-23T10:00:00.000Z",
  "updatedAt": "2025-10-23T10:00:00.000Z"
}
```

---

## 4. Criar Todo
**POST** `http://localhost:3000/api/todos`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "title": "Comprar leite",
  "description": "Ir ao mercado antes das 18h",
  "isDone": false,
  "reminder": "2025-10-24T10:00:00.000Z"
}
```

**Body Mínimo (apenas obrigatórios):**
```json
{
  "title": "Estudar TypeScript"
}
```

**Body com Reminder:**
```json
{
  "title": "Reunião com equipe",
  "description": "Discutir sprint planning",
  "reminder": "2025-10-25T14:00:00.000Z"
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Comprar leite",
  "description": "Ir ao mercado antes das 18h",
  "isDone": false,
  "reminder": "2025-10-24T10:00:00.000Z",
  "createdAt": "2025-10-23T10:00:00.000Z",
  "updatedAt": "2025-10-23T10:00:00.000Z"
}
```

---

## 5. Atualizar Todo
**PUT** `http://localhost:3000/api/todos/1`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON) - Todos os campos são opcionais:**
```json
  {
    "title": "Comprar leite e pão",
    "description": "Ir ao mercado antes das 18h",
    "isDone": true,
    "reminder": "2025-10-24T15:00:00.000Z"
  }
```

**Body - Atualizar apenas título:**
```json
{
  "title": "Novo título"
}
```

**Body - Marcar como concluído:**
```json
{
  "isDone": true
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Comprar leite e pão",
  "description": "Ir ao mercado antes das 18h",
  "isDone": true,
  "reminder": "2025-10-24T15:00:00.000Z",
  "createdAt": "2025-10-23T10:00:00.000Z",
  "updatedAt": "2025-10-23T11:30:00.000Z"
}
```

---

## 6. Alternar Status (Toggle Done)
**PATCH** `http://localhost:3000/api/todos/1/toggle`

**Response:**
```json
{
  "id": 1,
  "title": "Comprar leite",
  "description": "Ir ao mercado",
  "isDone": true,
  "reminder": "2025-10-24T10:00:00.000Z",
  "createdAt": "2025-10-23T10:00:00.000Z",
  "updatedAt": "2025-10-23T11:35:00.000Z"
}
```

---

## 7. Deletar Todo
**DELETE** `http://localhost:3000/api/todos/1`

**Response:**
```
Status: 204 No Content
```

---

## Respostas de Erro

### Todo não encontrado (404)
```json
{
  "error": "Não encontrado",
  "message": "Todo não encontrado"
}
```

### Erro de validação (400)
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

### Erro interno (500)
```json
{
  "error": "Erro interno do servidor"
}
```

---

## Dicas para Testar no Insomnia

1. **Criar Ambiente:**
   - Nome: `Todo API Local`
   - Base URL: `http://localhost:3000`

2. **Ordem de Testes:**
   1. Health Check
   2. Criar alguns Todos (POST)
   3. Listar Todos (GET)
   4. Buscar por ID (GET)
   5. Atualizar um Todo (PUT)
   6. Toggle Done (PATCH)
   7. Deletar um Todo (DELETE)

3. **Antes de testar:**
   - Execute `npm run dev` para iniciar o servidor
   - Execute `npx prisma db push` para criar o banco de dados
