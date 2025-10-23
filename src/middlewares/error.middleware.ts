import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  code?: string;
}

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  if (err.name === 'PrismaClientKnownRequestError') {
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
