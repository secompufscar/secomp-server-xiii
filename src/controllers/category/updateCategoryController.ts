import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { updateCategorySchema, categoryIdSchema } from '../../schemas/categorySchema';

const prisma = new PrismaClient();


export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome } = req.body;

  try {
    categoryIdSchema.parse({ id });
    updateCategorySchema.parse({ nome });
    
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { nome },
    });
    res.json(updatedCategory);
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    res.status(500).json({ message: 'Erro ao atualizar categoria' });
  }
};

export default {
  updateCategory
};
