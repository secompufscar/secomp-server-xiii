import activitiesRepository from "../repositories/activitiesRepository"
import usersAtActivitiesRepository from "../repositories/usersAtActivitiesRepository"

import { Activity } from "../entities/Activity"

export default {
    async findById(id: number) {
        const atividade = await activitiesRepository.findById(id)

        if (!atividade) {
            throw new Error('Atividade não encontrada')
        }

        return atividade
    },

    async list() {
        const activities = await activitiesRepository.list()
        
        return activities
    },

    async create({ nome, data, palestranteNome, categoriaId, vagas, detalhes }: Activity) {
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

    async update(id: number, { nome, data, palestranteNome, categoriaId }: Activity) {
        const existingAtividade = await activitiesRepository.findById(id)

        if (!existingAtividade) {
            throw new Error('Atividade não encontrada')
        }

        const updatedAtividade = await activitiesRepository.update(id, {
            nome,
            data,
            palestranteNome,
            categoriaId
        })

        return updatedAtividade
    },

    async delete(id: number) {
        const userAtActivities = await usersAtActivitiesRepository.findByActivityId(id)

        if (userAtActivities.length > 0) {
            throw new Error('Não é possível excluir esta atividade pois já possui associações de usuários.')
        }

        await activitiesRepository.delete(id)
    }
}