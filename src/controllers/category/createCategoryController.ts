// src/controllers/createCategory.ts
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const createCategory = async (req: Request, res: Response) => {
  const { nome } = req.body;

  try {
    const category = await prisma.category.create({
      data: { nome },
    });

    res.json(category);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ message: 'Erro ao criar categoria' });
  }
};

export default {
  createCategory,
};
