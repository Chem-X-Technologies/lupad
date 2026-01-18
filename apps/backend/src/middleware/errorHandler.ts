import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  // Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.issues.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // Unique constraint violation
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: 'A record with this value already exists',
        field: (err.meta?.target as string[])?.join(', '),
      });
    }

    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Record not found',
      });
    }
  }

  // Custom application error
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Default error
  const statusCode = 500;
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
