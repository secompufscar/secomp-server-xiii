import { PrismaClient } from "@prisma/client"

import { Diretoria } from "../entities/Diretoria"

const client = new PrismaClient()

export default {
    async list(): Promise<Diretoria[]> {
        const response = await client.diretoria.findMany()

        return response
    },

    async findById(id: number): Promise<Diretoria> {
        const response = await client.diretoria.findFirst({
            where: {
                id
            }
        })

        return response
    },

    async create(data: Diretoria): Promise<Diretoria> {
        const response = await client.diretoria.create({
            data
        })

        return response
    },

    async update(id: number, data: Diretoria): Promise<Diretoria> {
        const response = await client.diretoria.update({
            data,
            where: {
                id
            }
        })

        return response
    },

    async delete(id: number): Promise<void> {
        await client.diretoria.delete({
            where: {
                id
            }
        })
    }
}