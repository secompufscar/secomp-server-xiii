"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateActivitySchema = exports.activityIdSchema = exports.createActivitySchema = void 0;
// src/schemas/activitySchema.ts
const zod_1 = require("zod");
exports.createActivitySchema = zod_1.z.object({
    nome: zod_1.z.string().min(1, "Nome é obrigatório"),
    data: zod_1.z.string().optional().nullable(),
    palestranteNome: zod_1.z.string().min(1, "Nome do palestrante é obrigatório"),
    categoriaId: zod_1.z.string().uuid("ID de categoria inválido"),
    points: zod_1.z.number().int().min(0, "Pontos deve ser um número inteiro não negativo"),
});
exports.activityIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("ID de atividade inválido"),
    points: zod_1.z.number().int().min(0, "Pontos deve ser um número inteiro não negativo").optional(),
});
exports.updateActivitySchema = zod_1.z.object({
    nome: zod_1.z.string().min(1, "Nome é obrigatório").optional(),
    data: zod_1.z.string().optional().nullable(),
    palestranteNome: zod_1.z.string().min(1, "Nome do palestrante é obrigatório").optional(),
    categoriaId: zod_1.z.string().uuid("ID de categoria inválido").optional(),
});
