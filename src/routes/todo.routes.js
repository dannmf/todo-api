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
  todoController.list.bind(todoController)
);

// Buscar um todo por ID
router.get(
  '/:id',
  validate(todoIdSchema, 'params'),
  todoController.getById.bind(todoController)
);

// Criar um novo todo
router.post(
  '/',
  validate(createTodoSchema),
  todoController.create.bind(todoController)
);

// Atualizar um todo
router.put(
  '/:id',
  validate(todoIdSchema, 'params'),
  validate(updateTodoSchema),
  todoController.update.bind(todoController)
);

// Deletar um todo
router.delete(
  '/:id',
  validate(todoIdSchema, 'params'),
  todoController.delete.bind(todoController)
);

// Marcar/desmarcar como concluído
router.patch(
  '/:id/toggle',
  validate(todoIdSchema, 'params'),
  todoController.toggleDone.bind(todoController)
);

export default router;
