import type { Request, Response, NextFunction } from 'express';
import type { PrismaError, AppError } from '../types/index.js';

export const errorHandler = (
  err: AppError | PrismaError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  // Prisma errors
  if ('code' in err && err.code) {
    if (err.code === 'P2002') {
      res.status(409).json({
        error: 'Conflito',
        message: 'Já existe um registro com esses dados',
      });
      return;
    }
    if (err.code === 'P2025') {
      res.status(404).json({
        error: 'Não encontrado',
        message: 'Registro não encontrado',
      });
      return;
    }
  }

  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.url} não existe`,
  });
};
