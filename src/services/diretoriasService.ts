import diretoriasRepository from "../repositories/diretoriasRepository"



import { Activity } from "../entities/Activity"

// import { User } from "@prisma/client"

import { User } from "../entities/User"

export default {
    async findById(id: number) {
        const diretoria = await diretoriasRepository.findById(id)

        if (!diretoria) {
            throw new Error('Atividade não encontrada')
        }

        return diretoria
    },

    async list() {
        const diretorias = await diretoriasRepository.list()
        
        return diretorias
    },

    async create({ nome, data, palestranteNome, categoriaId, vagas, detalhes }: Activity) {
        const newData = data ? new Date(data) : null;

        const newAtividade = await diretoriasRepository.create({
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
        const existingAtividade = await diretoriasRepository.findById(id)

        if (!existingAtividade) {
            throw new Error('Atividade não encontrada')
        }

        const updatedAtividade = await diretoriasRepository.update(id, {
            nome,
            data,
            palestranteNome,
            categoriaId
        })

        return updatedAtividade
    },

    async delete(id: number) {
        const userAtActivities = await usersAtdiretoriasRepository.findByActivityId(id)

        if (userAtActivities.length > 0) {
            throw new Error('Não é possível excluir esta atividade pois já possui associações de usuários.')
        }

        await diretoriasRepository.delete(id)
    }
}