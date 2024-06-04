// validate.ts
import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

// Função de middleware de validação
const validate = (bodySchema?: ZodSchema<any>, pathSchema?: ZodSchema<any>) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // Valida o corpo da solicitação se o esquema do corpo estiver presente
    if (bodySchema) {
      bodySchema.parse(req.body);
    }

    // Valida os parâmetros de caminho se o esquema de caminho estiver presente
    if (pathSchema) {
      pathSchema.parse(req.params);
    }

    // Avança para o próximo middleware se a validação for bem-sucedida
    next();
  } catch (error) {
    // Manipula o erro de validação
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Erro de validação',
        errors: error.errors,
      });
    }
    next(error);
  }
};

export default validate;
