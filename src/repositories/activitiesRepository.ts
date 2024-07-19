import { PrismaClient } from "@prisma/client"

import { Activity } from "../entities/Activity"

const client = new PrismaClient()

export default {
    async list(): Promise<Activity[]> {
        const response = await client.activity.findMany()

        return response
    },

    async findById(id: number): Promise<Activity> {
        const response = await client.activity.findFirst({
            where: {
                id
            }
        })

        return response
    },

    async findManyByCategoryId(categoryId: number): Promise<Activity[]> {
        const response = await client.activity.findFirst({
            where: {
                categoryId
            }
        })

        return response
    },

    async create(data: Activity): Promise<Activity> {
        const response = await client.activity.create({
            data
        })

        return response
    },

    async update(id: number, data: Activity): Promise<Activity> {
        const response = await client.activity.update({
            data,
            where: {
                id
            }
        })

        return response
    },

    async delete(id: number): Promise<void> {
        await client.activity.delete({
            where: {
                id
            }
        })
    }
}