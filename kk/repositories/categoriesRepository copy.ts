import { PrismaClient } from "@prisma/client"

const client = new PrismaClient()

export default {
    async list() {
        const response = await client.activity.findMany({
            include: {
                usuario: true,
                atividade: {
                    include: {
                        grupo: true
                    }
                }
            }
        })
        return response
    },

    async findById(id) {
        const response = await client.activity.findFirst({
            where: {
                id
            }
        })

        return response
    },

    async create(data) {
        const response = await client.activity.create({
            data
        })

        return response
    },

    async update(id, data) {
        await client.activity.update({
            data,
            where: {
                id
            }
        })
    },

    async delete(id) {
        await client.activity.delete({
            where: {
                id
            }
        })
    }
}