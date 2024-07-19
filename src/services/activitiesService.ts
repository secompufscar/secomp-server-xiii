import activitiesRepository from "../repositories/activitiesRepository"
import usersAtActivitiesRepository from "../repositories/usersAtActivitiesRepository"

import { Activity } from "../entities/Activity"

import { ApiError, ErrorsCode } from "../utils/api-errors"

export default {
    async findById(id: number): Promise<Activity> {
        const atividade = await activitiesRepository.findById(id)

        if (!atividade) {
            throw new ApiError('Atividade não encontrada', ErrorsCode.NOT_FOUND)
        }

        return atividade
    },

    async list(): Promise<Activity[]> {
        const activities = await activitiesRepository.list()
        
        return activities
    },

    async create({ nome, data, palestranteNome, categoriaId, vagas, detalhes }: Activity): Promise<Activity> {
        const newData = data ? new Date(data) : null;

        const newAtividade = await activitiesRepository.create({
            nome,
            data: newData,
            palestranteNome,
            categoriaId,
            vagas,
            detalhes
        })

        return newAtividade
    },

    async update(id: number, { nome, data, palestranteNome, categoriaId }: Activity): Promise<Activity> {
        const existingAtividade = await activitiesRepository.findById(id)

        if (!existingAtividade) {
            throw new ApiError('Atividade não encontrada', ErrorsCode.NOT_FOUND)
        }

        const updatedAtividade = await activitiesRepository.update(id, {
            nome,
            data,
            palestranteNome,
            categoriaId
        })

        return updatedAtividade
    },

    async delete(id: number): Promise<void> {
        const userAtActivities = await usersAtActivitiesRepository.findManyByActivityId(id)

        if (userAtActivities.length > 0) {
            throw new ApiError('Não é possível excluir esta atividade pois já possui associações de usuários.', ErrorsCode.BAD_REQUEST)
        }

        await activitiesRepository.delete(id)
    }
}