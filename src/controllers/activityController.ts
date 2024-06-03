import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAtividade = async (req: Request, res: Response) => {
  const { nome, data, palestranteNome, categoriaId } = req.body;

  try {

    const newData = data ? new Date(data) : null;

    const newAtividade = await prisma.activity.create({
      data: {
        nome,
        data: newData, 
        palestranteNome,
        categoriaId,
      },
    });
    res.status(201).json(newAtividade);
  } catch (error) {
    console.error('Erro ao criar atividade:', error);
    res.status(500).json({ message: 'Erro ao criar atividade' });
  }
};
export const getAllAtividades = async (req: Request, res: Response) => {
  try {
    const atividades = await prisma.activity.findMany();
    res.json(atividades);
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    res.status(500).json({ message: 'Erro ao buscar atividades' });
  }
};

export const deleteAtividade = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const deletedAtividade = await prisma.activity.delete({
      where: { id },
    });
    res.json(deletedAtividade);
  } catch (error) {
    console.error('Erro ao excluir atividade:', error);
    res.status(500).json({ message: 'Erro ao excluir atividade' });
  }
};



export const updateAtividade = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome, data, palestranteNome, categoriaId } = req.body;

  try {
    // Encontra a atividade existente
    const existingAtividade = await prisma.activity.findUnique({
      where: { id },
    });

    if (!existingAtividade) {
      return res.status(404).json({ message: 'Atividade não encontrada' });
    }

    const updatedData: Record<string, any> = {};
    if (nome !== undefined) updatedData.nome = nome;
    if (data !== undefined) updatedData.data = new Date(data);
    if (palestranteNome !== undefined) updatedData.palestranteNome = palestranteNome;
    if (categoriaId !== undefined) updatedData.categoriaId = categoriaId;

    const updatedAtividade = await prisma.activity.update({
      where: { id },
      data: updatedData,
    });

    res.json(updatedAtividade);
  } catch (error) {
    console.error('Erro ao atualizar atividade:', error);
    res.status(500).json({ message: 'Erro ao atualizar atividade' });
  }
};

export default {
  createAtividade,
  getAllAtividades,
  deleteAtividade,
  updateAtividade
};