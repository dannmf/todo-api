import { Router } from 'express';
import { TodoController } from '../controllers/todo.controller.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  createTodoSchema,
  updateTodoSchema,
  todoIdSchema,
  listTodosQuerySchema,
} from '../validators/todo.validator.js';

const router = Router();
const todoController = new TodoController();

// Listar todos os todos (com filtros opcionais)
router.get(
  '/',
  validate(listTodosQuerySchema, 'query'),
  todoController.list
);

// Buscar um todo por ID
router.get(
  '/:id',
  validate(todoIdSchema, 'params'),
  todoController.getById
);

// Criar um novo todo
router.post(
  '/',
  validate(createTodoSchema),
  todoController.create
);

// Atualizar um todo
router.put(
  '/:id',
  validate(todoIdSchema, 'params'),
  validate(updateTodoSchema),
  todoController.update
);

// Deletar um todo
router.delete(
  '/:id',
  validate(todoIdSchema, 'params'),
  todoController.delete
);

// Marcar/desmarcar como concluído
router.patch(
  '/:id/toggle',
  validate(todoIdSchema, 'params'),
  todoController.toggleDone
);

export default router;
