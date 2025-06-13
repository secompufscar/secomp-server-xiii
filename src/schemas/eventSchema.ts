// src/schemas/eventSchema.ts
import { z } from "zod";

export const eventIdSchema = z.object({
  id: z.string().uuid('ID deve ser um UUID válido')
});

export const createEventSchema = z.object({
  year: z.number()
    .int('Ano deve ser inteiro')
    .min(2000, 'Ano mínimo é 2000')
    .max(2100, 'Ano máximo é 2100'),
  startDate: z.string()
    .datetime({ offset: true }),
  endDate: z.string()
    .datetime({ offset: true })
}).superRefine((data, ctx) => {
  if (new Date(data.endDate) <= new Date(data.startDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Data de término deve ser após a data de início'
    });
  }
});

export const updateEventSchema = z.object({
  year: z.number()
    .int('Ano deve ser inteiro')
    .min(2000, 'Ano mínimo é 2000')
    .max(2100, 'Ano máximo é 2100'),
  startDate: z.string()
    .datetime({ offset: true }),
  endDate: z.string()
    .datetime({ offset: true })
}).superRefine((data, ctx) => {
  if (new Date(data.endDate) <= new Date(data.startDate)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Data de término deve ser após a data de início'
    });
  }
});

