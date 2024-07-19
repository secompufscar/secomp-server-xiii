import { PrismaClient } from "@prisma/client"

import { Category } from "../entities/Category"

const client = new PrismaClient()

export default {
    async list(): Promise<Category[]> {
        const response = await client.category.findMany({
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

    async findById(id: number): Promise<Category> {
        const response = await client.category.findFirst({
            where: {
                id
            }
        })

        return response
    },

    async create(data: Category): Promise<Category> {
        const response = await client.category.create({
            data
        })

        return response
    },

    async update(id: number, data: Category): Promise<Category> {
        const response = await client.category.update({
            data,
            where: {
                id
            }
        })

        return response
    },

    async delete(id: number): Promise<void> {
        await client.category.delete({
            where: {
                id
            }
        })
    }
}