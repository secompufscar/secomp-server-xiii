import { Category } from '../entities/Category';

import categoriesRepository from '../repositories/categoriesRepository';
import activitiesRepository from '../repositories/activitiesRepository';

export default {
    async findById(id: number) {
        const category = await categoriesRepository.findById(id)

        if (!category) {
            throw new Error('Categoria não encontrada')
        }

        return category
    },

    async list() {
        const categories = await categoriesRepository.list()
        
        return categories
    },

    async create({ nome }: Category) {
        const category = await categoriesRepository.create({
            nome
        })

        return category
    },

    async update(id: number, { nome }: Category) {
        const updatedCategory = await categoriesRepository.update(id, {
            nome
        })

        return updatedCategory
    },

    async delete(id: number) {
        const existingActivities = await activitiesRepository.findManyByCategoryId(id)

        if (existingActivities.length > 0) {
            throw new Error('Esta categoria não pode ser excluída porque ainda existem atividades vinculadas a ela.')
        }

        const deletedCategory = await categoriesRepository.delete(id)

        return deletedCategory
    }
}