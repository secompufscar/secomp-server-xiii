import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { categoryIdSchema } from '../../schemas/categorySchema'; // Importe o esquema de validação

const prisma = new PrismaClient();

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    categoryIdSchema.parse( {id} );

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return res.status(404).json({ message: 'Categoria não encontrada' });
    }

    res.json(category);
  } catch (error) {
    console.error('Erro ao buscar categoria por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar categoria por ID' });
  }
};

export default {
  getCategoryById,
};
