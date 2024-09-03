import activitiesRepository from "../repositories/activitiesRepository"
import usersAtActivitiesRepository from "../repositories/usersAtActivitiesRepository"

import { Activity } from "../entities/Activity"

import { ApiError, ErrorsCode } from "../utils/api-errors"

import { UpdateActivityDTOS, CreateActivityDTOS, ActivityDTOS } from "../dtos/activitiesDtos"

export default {
    async findById(id: string): Promise<ActivityDTOS> {
        const atividade = await activitiesRepository.findById(id)

        if (!atividade) {
            throw new ApiError('Atividade não encontrada', ErrorsCode.NOT_FOUND)
        }

        return atividade
    },

    async list(): Promise<ActivityDTOS[]> {
        const activities = await activitiesRepository.list()
        
        return activities
    },

    async create({ nome, data, palestranteNome, categoriaId, vagas, detalhes, local }: CreateActivityDTOS): Promise<CreateActivityDTOS> {
        const newData = data ? new Date(data) : null;

        const newAtividade = await activitiesRepository.create({
            nome,
            data: newData,
            palestranteNome,
            categoriaId,
            vagas,
            detalhes,
            local,
        })

        return newAtividade
    },

    async update(id: string, { nome, data, palestranteNome, categoriaId, detalhes, local }: UpdateActivityDTOS ): Promise<UpdateActivityDTOS> {
        const existingAtividade = await activitiesRepository.findById(id)

        if (!existingAtividade) {
            throw new ApiError('Atividade não encontrada', ErrorsCode.NOT_FOUND)
        }

        const updatedAtividade = await activitiesRepository.update(id, {
            nome,
            data,
            palestranteNome,
            categoriaId,
            detalhes,
            local,
        })

        return updatedAtividade
    },

    async delete(id: string): Promise<void> {
        const userAtActivities = await usersAtActivitiesRepository.findManyByActivityId(id)

        if (userAtActivities.length > 0) {
            throw new ApiError('Não é possível excluir esta atividade pois já possui associações de usuários.', ErrorsCode.BAD_REQUEST)
        }

        await activitiesRepository.delete(id)
    }
}