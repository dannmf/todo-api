import { z } from 'zod';

// Schema para criação de um todo
export const createTodoSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório').max(255),
  description: z.string().max(1000).optional().nullable(),
  isDone: z.boolean().default(false),
  reminder: z.string().datetime().optional().nullable(),
});

// Schema para atualização de um todo
export const updateTodoSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(1000).optional().nullable(),
  isDone: z.boolean().optional(),
  reminder: z.string().datetime().optional().nullable(),
});

// Schema para validação de ID
export const todoIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID deve ser um número').transform(Number),
});

// Schema para query params de listagem
export const listTodosQuerySchema = z.object({
  isDone: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  search: z.string().optional(),
});
