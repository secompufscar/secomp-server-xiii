import { PrismaClient } from "@prisma/client"

import { UserAtActivity } from "../entities/UserAtActivity"

const client = new PrismaClient()

export default {
    async list(): Promise<UserAtActivity[]> {
        const response = await client.userAtActivity.findMany()

        return response
    },

    async findById(id: number): Promise<UserAtActivity> {
        const response = await client.userAtActivity.findFirst({
            where: {
                id
            }
        })

        return response
    },

    async findManyByActivityId(activityId: number): Promise<UserAtActivity[]> {
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

    async findManyByUserId(userId: number): Promise<UserAtActivity[]> {
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

    async findManyByUserIdAndActivityId(userId: number, activityId: number): Promise<UserAtActivity[]> {
        const response = await client.userAtActivity.findMany({
            where: {
                userId: userId,
                activityId: activityId
            }
        })

        return response
    },


    async create(data: UserAtActivity): Promise<UserAtActivity> {
        const response = await client.userAtActivity.create({
            data
        })

        return response
    },

    async update(id: number, data: UserAtActivity): Promise<UserAtActivity> {
        const response = await client.userAtActivity.update({
            data,
            where: {
                id
            }
        })

        return response
    },

    async delete(id: number): Promise<void> {
        await client.userAtActivity.delete({
            where: {
                id
            }
        })
    }
}