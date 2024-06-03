import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

const createCategory = async (req: Request, res: Response) => {
  const { nome } = req.body;
  console.log('req', req.body)

  try {
    const category = await prisma.category.create({
      data: {
        nome
      }
    });

    res.json(category);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    res.status(500).json({ message: 'Erro ao criar categoria' });
  }
};


const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    res.status(500).json({ message: 'Erro ao buscar categorias' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedCategory = await prisma.category.delete({
      where: { id }
    });
    res.json(deletedCategory);
  } catch (error) {
    console.error('Erro ao excluir categoria:', error);
    res.status(500).json({ message: 'Erro ao excluir categoria' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nome } = req.body;

  try {
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
  createCategory,
  getAllCategories,
  deleteCategory,
  updateCategory
};
