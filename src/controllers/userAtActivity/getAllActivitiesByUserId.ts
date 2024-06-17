import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllActivitiesByUserId = async (req: Request, res: Response) => {
  const { userId } = req.params;
  
  try {
    console.log(userId)

    const userActivities = await prisma.userAtActivity.findMany({
      where: {
        userId: userId,
      },
      include: {
        activity: true, // Incluir os detalhes da atividade associada
      },
    });

    // Extrair apenas as atividades da resposta
   // const activities = userActivities.map((ua) => ua.activity);

    res.status(200).json(userActivities);
  } catch (error) {
    console.error('Erro ao buscar atividades por userId:', error);
    res.status(500).json({ message: 'Erro ao buscar atividades por userId', error });
  } 
};
