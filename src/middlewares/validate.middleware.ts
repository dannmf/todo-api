import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

type ValidationSource = 'body' | 'params' | 'query';

export const validate = (schema: ZodSchema, source: ValidationSource = 'body') => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = source === 'params' ? req.params :
                   source === 'query' ? req.query :
                   req.body;

      const validated = await schema.parseAsync(data);

      if (source === 'params') {
        req.params = validated;
      } else if (source === 'query') {
        req.query = validated;
      } else {
        req.body = validated;
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Erro de validação',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
};
