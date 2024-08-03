"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
// src/schemas/categorySchema.ts
const zod_1 = require("zod");
exports.createCategorySchema = zod_1.z.object({
    nome: zod_1.z.string().min(1, "Nome é obrigatório"),
});
exports.updateCategorySchema = zod_1.z.object({
    nome: zod_1.z.string().min(1, "Nome é obrigatório"),
});
exports.categoryIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid("ID inválido"),
});
