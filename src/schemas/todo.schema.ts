import { z } from 'zod';

export const TodoSchema = z.object({
    id: z.uuid(),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    isCompleted: z.boolean().default(false),
    reminder: z.date().optional(),
    createdAt: z.date().default(() => new Date()),
    updatedAt: z.date().default(() => new Date()),
});

export const CreateTodoSchema = TodoSchema.omit({
    id: true,
    createdAt: true,
    updateAt: true,
});

export const UpdateTodoSchema = CreateTodoSchema.partial();