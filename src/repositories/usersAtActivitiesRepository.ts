import { PrismaClient } from "@prisma/client"

import { UserAtActivity } from "../entities/UserAtActivity"

import { UpdateUserAtActivityDTOS, CreateUserAtActivityDTOS } from "../dtos/userAtActivitiesDtos"

const client = new PrismaClient()

export default {
    async list(): Promise<UserAtActivity[]> {
        const response = await client.userAtActivity.findMany()

        return response
    },

    async findById(id: string): Promise<UserAtActivity | null> {
        const response = await client.userAtActivity.findFirst({
            where: {
                id
            }
        })

        return response
    },

    async findManyByActivityId(activityId: string): Promise<UserAtActivity[]> {
        const response = await client.userAtActivity.findMany({
            where: {
                activityId: activityId
            },
            include: {
                user: true
            }
        })

        return response
    },

    async findManyByUserId(userId: string): Promise<UserAtActivity[]> {
        const response = await client.userAtActivity.findMany({
            where: {
                userId: userId
            },
            include: {
                user: true
            }
        })

        return response
    },

    async findManyByUserIdAndActivityId(userId: string, activityId: string): Promise<UserAtActivity[]> {
        const response = await client.userAtActivity.findMany({
            where: {
                userId: userId,
                activityId: activityId
            }
        })

        return response
    },


    async create(data: CreateUserAtActivityDTOS): Promise<CreateUserAtActivityDTOS> {
        const response = await client.userAtActivity.create({
            data
        })

        return response
    },

    async update(id: string, data: UpdateUserAtActivityDTOS): Promise<UpdateUserAtActivityDTOS> {
        const response = await client.userAtActivity.update({
            data,
            where: {
                id
            }
        })

        return response
    },

    async delete(id: string): Promise<void> {
        await client.userAtActivity.delete({
            where: {
                id
            }
        })
    }
}