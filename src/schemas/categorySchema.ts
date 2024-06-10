// src/schemas/categorySchema.ts
import { z } from 'zod';

export const createCategorySchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
});

export const updateCategorySchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
});

export const categoryIdSchema = z.object({
  id: z.string().uuid("ID inválido"),
});