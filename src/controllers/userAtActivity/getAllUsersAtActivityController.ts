import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getUserAtActivityByActivityId = async (req: Request, res: Response) => {
  const { activityId } = req.params;

  try {
    const userAtActivities = await prisma.userAtActivity.findMany({
      where: {
        activityId: activityId,
      },
      include: {
        user: true,
      },
    });

    res.status(200).json(userAtActivities);
  } catch (error) {
    console.error('Erro ao buscar associações usuário-atividade por activityId:', error);
    res.status(500).json({ message: 'Erro ao buscar associações usuário-atividade por activityId', error });
  }
};
