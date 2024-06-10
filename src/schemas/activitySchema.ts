// src/schemas/activitySchema.ts
import { z } from 'zod';

export const createActivitySchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  data: z.string().optional().nullable(),
  palestranteNome: z.string().min(1, "Nome do palestrante é obrigatório"),
  categoriaId: z.string().uuid("ID de categoria inválido"),
});


export const activityIdSchema = z.object({
    id: z.string().uuid("ID de atividade inválido"),
  });


export const updateActivitySchema = z.object({
    nome: z.string().min(1, "Nome é obrigatório").optional(),
    data: z.string().optional().nullable(),
    palestranteNome: z.string().min(1, "Nome do palestrante é obrigatório").optional(),
    categoriaId: z.string().uuid("ID de categoria inválido").optional(),
});