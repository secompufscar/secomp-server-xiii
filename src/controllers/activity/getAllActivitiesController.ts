import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


export const getAllAtividades = async (req: Request, res: Response) => {
  try {
    const atividades = await prisma.activity.findMany();
    res.json(atividades);
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    res.status(500).json({ message: 'Erro ao buscar atividades' });
  }
};


export default {

  getAllAtividades,

};