"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod"); // Certifique-se de importar ZodError
const errorHandler = (err, req, res, next) => {
    if (err instanceof zod_1.ZodError) {
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
exports.default = errorHandler;
