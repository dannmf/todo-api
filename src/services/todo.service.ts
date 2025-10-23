import prisma from '../config/database.js';
import { Prisma } from '@prisma/client';

export interface CreateTodoData {
  title: string;
  description?: string | null;
  isDone?: boolean;
  reminder?: string | null;
}

export interface UpdateTodoData {
  title?: string;
  description?: string | null;
  isDone?: boolean;
  reminder?: string | null;
}

export interface ListTodosFilters {
  isDone?: boolean;
  search?: string;
}

export class TodoService {
  async findAll(filters?: ListTodosFilters) {
    const where: Prisma.TodoWhereInput = {};

    if (filters?.isDone !== undefined) {
      where.isDone = filters.isDone;
    }

    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
      ];
    }

    return await prisma.todo.findMany({
      where,
      orderBy: [
        { isDone: 'asc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async findById(id: number) {
    return await prisma.todo.findUnique({
      where: { id },
    });
  }

  async create(data: CreateTodoData) {
    return await prisma.todo.create({
      data: {
        title: data.title,
        description: data.description,
        isDone: data.isDone ?? false,
        reminder: data.reminder ? new Date(data.reminder) : null,
      },
    });
  }

  async update(id: number, data: UpdateTodoData) {
    const updateData: Prisma.TodoUpdateInput = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.isDone !== undefined) updateData.isDone = data.isDone;
    if (data.reminder !== undefined) {
      updateData.reminder = data.reminder ? new Date(data.reminder) : null;
    }

    return await prisma.todo.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: number) {
    return await prisma.todo.delete({
      where: { id },
    });
  }

  async toggleDone(id: number) {
    const todo = await this.findById(id);

    if (!todo) {
      return null;
    }

    return await prisma.todo.update({
      where: { id },
      data: { isDone: !todo.isDone },
    });
  }
}
