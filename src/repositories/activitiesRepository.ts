import { PrismaClient } from "@prisma/client"

import { Activity } from "../entities/Activity"

import { UpdateActivityDTOS, CreateActivityDTOS, ActivityDTOS } from "../dtos/activitiesDtos"

const client = new PrismaClient()

export default {
    async list(): Promise<ActivityDTOS[]> {
        const response = await client.activity.findMany()

        return response
    },

    async findById(id: string): Promise<ActivityDTOS | null> {
        const response = await client.activity.findFirst({
            where: {
                id
            }
        })

        return response
    },

    async findManyByCategoryId(categoriaId: string): Promise<ActivityDTOS[] | null> {
        const response = await client.activity.findMany({
            where: {
                categoriaId
            }
        })
 

        return response
    },

    async create(data: CreateActivityDTOS): Promise<CreateActivityDTOS> {
        const response = await client.activity.create({
            data
        })

        return response
    },

    async update(id: string, data: UpdateActivityDTOS): Promise<UpdateActivityDTOS> {
        const response = await client.activity.update({
            data,
            where: {
                id
            }
        })

        return response
    },

    async delete(id: string): Promise<void> {
        await client.activity.delete({
            where: {
                id
            }
        })
    }
}