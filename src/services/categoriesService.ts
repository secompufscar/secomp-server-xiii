import categoriesRepository from "../repositories/categoriesRepository";
import activitiesRepository from "../repositories/activitiesRepository";
import { CreateCategoryrDTOS, UpdateCategoryrDTOS } from "../dtos/categoriesDtos";
import { ApiError, ErrorsCode } from "../utils/api-errors";

export default {
  async findById(id: string) {
    const category = await categoriesRepository.findById(id);

    if (!category) {
      throw new ApiError("category was not found by this id", ErrorsCode.NOT_FOUND);
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
    const previousCategory = await categoriesRepository.findById(id);

    if (!previousCategory) {
      throw new ApiError("category was not found by this id", ErrorsCode.NOT_FOUND);
    }
    const updatedCategory = await categoriesRepository.update(id, { nome });
    return updatedCategory;
  },

  async delete(id: string) {
    const existingActivities = await activitiesRepository.findManyByCategoryId(id);

    if (!existingActivities) {
      throw new ApiError("esta categoria nao pode ser excluida porque ainda há atividades nela", ErrorsCode.CONFLICT);
    }

    const deletedCategory = await categoriesRepository.delete(id);
    return deletedCategory;
  },
};
