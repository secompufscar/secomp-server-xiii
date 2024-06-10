import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { categoryIdSchema } from '../../schemas/categorySchema';


const prisma = new PrismaClient();

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    categoryIdSchema.parse({ id });

    const existingActivities = await prisma.activity.findMany({
      where: {
        categoriaId: id,
      },
    });

    if (existingActivities.length > 0) {
      return res.status(400).json({ 
        message: 'Esta categoria não pode ser excluída porque ainda existem atividades vinculadas a ela.',
      });
    }

    const deletedCategory = await prisma.category.delete({
      where: { id },
    });

    res.json(deletedCategory);
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({ message: 'Erro ao excluir categoria' });
  }
};

export default {
  deleteCategory,
};

