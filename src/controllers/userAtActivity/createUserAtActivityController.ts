import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';


export const createUserAtActivity = async (req: Request, res: Response) => {
  const { userId, activityId, presente, inscricaoPrevia, listaEspera } = req.body;

  const prisma = new PrismaClient();

  try {
    const existingUserAtActivity = await prisma.userAtActivity.findFirst({
        where: {
          userId: userId,
          activityId: activityId,
        },
      });
  
      if (existingUserAtActivity) {
        return res.status(400).json({ message: 'Usuário já está associado a esta atividade.' });
      }
      
    const userAtActivity = await prisma.userAtActivity.create({
      data: {
        userId,
        activityId,
        presente,
        inscricaoPrevia,
        listaEspera,
      },
    });

    res.status(201).json(userAtActivity);
  } catch (error) {
    console.error('Erro ao criar associação usuário-atividade:', error);
    res.status(500).json({ message: 'Erro ao criar associação usuário-atividade', error });
  }
};
