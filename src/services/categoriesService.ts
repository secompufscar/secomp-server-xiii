import categoriesRepository from "../repositories/categoriesRepository";
import activitiesRepository from "../repositories/activitiesRepository";
import { CreateCategoryrDTOS, UpdateCategoryrDTOS } from "../dtos/categoriesDtos";

export default {
  async findById(id: string) {
    const category = await categoriesRepository.findById(id);

    if (!category) {
      throw new Error("Categoria não encontrada");
    }

    return category;
  },

  async list() {
    const categories = await categoriesRepository.list();
    return categories;
  },

  async create({ nome }: CreateCategoryrDTOS) {
    const category = await categoriesRepository.create({
      nome,
    });
    return category;
  },

  async update(id: string, { nome }: UpdateCategoryrDTOS) {
    const updatedCategory = await categoriesRepository.update(id, {
      nome,
    });
    return updatedCategory;
  },

  async delete(id: string) {
    const existingActivities = await activitiesRepository.findManyByCategoryId(id);

    if (existingActivities == null) {
      throw new Error(
        "Esta categoria não pode ser excluída porque ainda existem atividades vinculadas a ela."
      );
    }

    const deletedCategory = await categoriesRepository.delete(id);
    return deletedCategory;
  },
};