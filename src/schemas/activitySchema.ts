// src/schemas/activitySchema.ts
import { z } from "zod";

export const createActivitySchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  data: z.string().optional().nullable(),
  palestranteNome: z.string().min(1, "Nome do palestrante é obrigatório"),
  points: z.number().int().min(0, "Pontos deve ser um número inteiro não negativo"),
});

export const activityIdSchema = z.object({
  id: z.string().uuid("ID de atividade inválido"),
  points: z.number().int().min(0, "Pontos deve ser um número inteiro não negativo").optional(),
});

export const updateActivitySchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").optional(),
  data: z.string().optional().nullable(),
  palestranteNome: z.string().min(1, "Nome do palestrante é obrigatório").optional(),
});
