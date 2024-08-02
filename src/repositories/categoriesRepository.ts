import { PrismaClient } from "@prisma/client"

import { Category } from "../entities/Category"

import { CreateCategoryrDTOS, UpdateCategoryrDTOS,CategoryrDTOS } from "../dtos/categoriesDtos"

const client = new PrismaClient()

export default {
    async list(): Promise<CategoryrDTOS[]> {
        const response = await client.category.findMany()
        return response
    },

    async findById(id: string): Promise<CategoryrDTOS | null> {
        const response = await client.category.findFirst({
            where: {
                id
            }
        })

        return response
    },

    async create(data: CreateCategoryrDTOS): Promise<CreateCategoryrDTOS> {
        const response = await client.category.create({
            data
        })

        return response
    },

    async update(id: string, data: UpdateCategoryrDTOS): Promise<UpdateCategoryrDTOS> {
        const response = await client.category.update({
            data,
            where: {
                id
            }
        })

        return response
    },

    async delete(id: string): Promise<void> {
        await client.category.delete({
            where: {
                id
            }
        })
    }
}