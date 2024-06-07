// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod'; // Certifique-se de importar ZodError

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: 'Erro de validação',
      errors: err.errors,
    });
  }

  res.status(err.statusCode || 500).json({
    message: err.message || 'Erro interno do servidor',
    errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR',
    errors: err.errors || [],
  });
};

export default errorHandler;
