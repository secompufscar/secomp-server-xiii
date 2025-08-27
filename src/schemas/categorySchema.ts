import { z } from "zod";

const categoryNameSchema = z.object({
  nome: z.string({
    required_error: "Nome é obrigatório",
    invalid_type_error: "Nome deve ser um texto",
  }).min(1, "Nome não pode ser vazio"),
});

export const createCategorySchema = categoryNameSchema;

export const updateCategorySchema = categoryNameSchema;

export const categoryParamsSchema = z.object({
  id: z.string().uuid("ID de categoria inválido"),
});