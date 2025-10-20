import prisma from '../config/database.js';

export class TodoController {
  // Listar todos os todos
  async list(req, res, next) {
    try {
      const { isDone, search } = req.query;

      const where = {};

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
  }

  // Buscar um todo por ID
  async getById(req, res, next) {
    try {
      const { id } = req.params;

      const todo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!todo) {
        return res.status(404).json({
          error: 'Não encontrado',
          message: 'Todo não encontrado',
        });
      }

      res.json(todo);
    } catch (error) {
      next(error);
    }
  }

  // Criar um novo todo
  async create(req, res, next) {
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
  }

  // Atualizar um todo
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { title, description, isDone, reminder } = req.body;

      // Verifica se o todo existe
      const existingTodo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!existingTodo) {
        return res.status(404).json({
          error: 'Não encontrado',
          message: 'Todo não encontrado',
        });
      }

      // Atualiza apenas os campos fornecidos
      const updateData = {};
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
  }

  // Deletar um todo
  async delete(req, res, next) {
    try {
      const { id } = req.params;

      // Verifica se o todo existe
      const existingTodo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!existingTodo) {
        return res.status(404).json({
          error: 'Não encontrado',
          message: 'Todo não encontrado',
        });
      }

      await prisma.todo.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Marcar/desmarcar como concluído
  async toggleDone(req, res, next) {
    try {
      const { id } = req.params;

      const existingTodo = await prisma.todo.findUnique({
        where: { id },
      });

      if (!existingTodo) {
        return res.status(404).json({
          error: 'Não encontrado',
          message: 'Todo não encontrado',
        });
      }

      const todo = await prisma.todo.update({
        where: { id },
        data: { isDone: !existingTodo.isDone },
      });

      res.json(todo);
    } catch (error) {
      next(error);
    }
  }
}
