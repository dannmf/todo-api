import { Router } from 'express';
import todoRoutes from './todo.routes.js';

const router = Router();

// Rota de health check
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Rotas de todos
router.use('/todos', todoRoutes);

export default router;
