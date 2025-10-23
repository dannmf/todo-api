import { Request, Response, NextFunction } from 'express';
import { TodoService } from '../services/todo.service.js';

export class TodoController {
  private todoService: TodoService;

  constructor() {
    this.todoService = new TodoService();
  }

  // Listar todos os todos
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { isDone, search } = req.query;

      const todos = await this.todoService.findAll({
        isDone: isDone as boolean | undefined,
        search: search as string | undefined,
      });

      res.json(todos);
    } catch (error) {
      next(error);
    }
  }

  // Buscar um todo por ID
  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const todoId = Number(id);

      const todo = await this.todoService.findById(todoId);

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
  }

  // Criar um novo todo
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { title, description, isDone, reminder } = req.body;

      const todo = await this.todoService.create({
        title,
        description,
        isDone,
        reminder,
      });

      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  }

  // Atualizar um todo
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const todoId = Number(id);
      const { title, description, isDone, reminder } = req.body;

      // Verifica se o todo existe
      const existingTodo = await this.todoService.findById(todoId);

      if (!existingTodo) {
        res.status(404).json({
          error: 'Não encontrado',
          message: 'Todo não encontrado',
        });
        return;
      }

      const todo = await this.todoService.update(todoId, {
        title,
        description,
        isDone,
        reminder,
      });

      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  // Deletar um todo
  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const todoId = Number(id);

      // Verifica se o todo existe
      const existingTodo = await this.todoService.findById(todoId);

      if (!existingTodo) {
        res.status(404).json({
          error: 'Não encontrado',
          message: 'Todo não encontrado',
        });
        return;
      }

      await this.todoService.delete(todoId);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Marcar/desmarcar como concluído
  async toggleDone(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const todoId = Number(id);

      const todo = await this.todoService.toggleDone(todoId);

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
  }
}
