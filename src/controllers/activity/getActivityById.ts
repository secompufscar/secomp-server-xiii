import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { activityIdSchema } from '../../schemas/activitySchema';

const prisma = new PrismaClient();

export const getActivityById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    activityIdSchema.parse({ id });
    
    const atividade = await prisma.activity.findUnique({
      where: { id },
    });

    if (!atividade) {
      return res.status(404).json({ message: 'Atividade não encontrada' });
    }

    res.json(atividade);
  } catch (error) {
    console.error('Erro ao buscar atividade por ID:', error);
    res.status(500).json({ message: 'Erro ao buscar atividade por ID' });
  }
};

export default {
  getActivityById,
};
