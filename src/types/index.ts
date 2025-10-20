import type { Request, Response, NextFunction } from 'express';

// Type-safe Express handlers
export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Prisma error types
export interface PrismaError extends Error {
  code?: string;
  meta?: Record<string, unknown>;
}

// Custom error types
export interface AppError extends Error {
  status?: number;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
