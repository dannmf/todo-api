import { z } from 'zod';
import { TodoSchema, CreateTodoSchema, UpdateTodoSchema } from './todo.schema';

export type Todo = z.infer<typeof TodoSchema>;
export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;