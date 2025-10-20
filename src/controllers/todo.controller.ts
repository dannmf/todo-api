import type { Response, NextFunction } from 'express';
import type { AsyncRequestHandler } from '../types/index.js';
import type {
  CreateTodoInput,
  UpdateTodoInput,
  TodoIdParams,
  ListTodosQuery,
} from '../validators/todo.validator.js';
import prisma from '../config/database.js';

// Tipos estendidos do Request com body/params/query tipados
interface TypedRequest<TBody = unknown, TParams = unknown, TQuery = unknown> {
  body: TBody;
  params: TParams;
  query: TQuery;
}

export class TodoController {
  // Listar todos os todos
  list: AsyncRequestHandler = async (
    req: TypedRequest<unknown, unknown, ListTodosQuery>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { isDone, search } = req.query;

      const where: {
        isDone?: boolean;
        OR?: Array<{
          title?: { contains: string; mode: 'insensitive' };
          description?: { contains: string; mode: 'insensitive' };
        }>;
      } = {};

      if (isDone !== undefined) {
        where.isDone = isDone;
      }

      if (search) {
        where.OR = [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const todos = await prisma.todo.findMany({
        where,
        orderBy: [
          { isDone: 'asc' },
          { createdAt: 'desc' },
        ],
      });

      res.json(todos);
    } catch (error) {
      next(error);
    }
  };

  // Buscar um todo por ID
  getById: AsyncRequestHandler = async (
    req: TypedRequest<unknown, TodoIdParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const todo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!todo) {
        res.status(404).json({
          error: 'Não encontrado',
          message: 'Todo não encontrado',
        });
        return;
      }

      res.json(todo);
    } catch (error) {
      next(error);
    }
  };

  // Criar um novo todo
  create: AsyncRequestHandler = async (
    req: TypedRequest<CreateTodoInput>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { title, description, isDone, reminder } = req.body;

      const todo = await prisma.todo.create({
        data: {
          title,
          description,
          isDone,
          reminder: reminder ? new Date(reminder) : null,
        },
      });

      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  };

  // Atualizar um todo
  update: AsyncRequestHandler = async (
    req: TypedRequest<UpdateTodoInput, TodoIdParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { title, description, isDone, reminder } = req.body;

      // Verifica se o todo existe
      const existingTodo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!existingTodo) {
        res.status(404).json({
          error: 'Não encontrado',
          message: 'Todo não encontrado',
        });
        return;
      }

      // Atualiza apenas os campos fornecidos
      const updateData: {
        title?: string;
        description?: string | null;
        isDone?: boolean;
        reminder?: Date | null;
      } = {};

      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (isDone !== undefined) updateData.isDone = isDone;
      if (reminder !== undefined) updateData.reminder = reminder ? new Date(reminder) : null;

      const todo = await prisma.todo.update({
        where: { id },
        data: updateData,
      });

      res.json(todo);
    } catch (error) {
      next(error);
    }
  };

  // Deletar um todo
  delete: AsyncRequestHandler = async (
    req: TypedRequest<unknown, TodoIdParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      // Verifica se o todo existe
      const existingTodo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!existingTodo) {
        res.status(404).json({
          error: 'Não encontrado',
          message: 'Todo não encontrado',
        });
        return;
      }

      await prisma.todo.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };

  // Marcar/desmarcar como concluído
  toggleDone: AsyncRequestHandler = async (
    req: TypedRequest<unknown, TodoIdParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;

      const existingTodo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!existingTodo) {
        res.status(404).json({
          error: 'Não encontrado',
          message: 'Todo não encontrado',
        });
        return;
      }

      const todo = await prisma.todo.update({
        where: { id },
        data: { isDone: !existingTodo.isDone },
      });

      res.json(todo);
    } catch (error) {
      next(error);
    }
  };
}
