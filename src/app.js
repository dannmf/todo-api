import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas da API
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Todo API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      todos: '/api/todos',
    },
  });
});

// Handlers de erro
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
