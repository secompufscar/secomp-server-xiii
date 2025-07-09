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
                userId,
            },
            include: {
                user: true,
                activity: true
            }
        
        })

        return response
    },

    async findByUserIdAndActivityId(userId: string, activityId: string): Promise<UserAtActivity | null> {
        const response = await client.userAtActivity.findFirst({
            where: {
                userId,
                activityId,
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
    async findFirstInWaitlist(activityId: string): Promise<UserAtActivity | null> {
        return await client.userAtActivity.findFirst({
            where: {
                activityId: activityId,
                listaEspera: true
            },
            orderBy: {
                createdAt: 'asc' // Ordena para pegar o primeiro da lista de espera
            }
        });
    },

    async delete(id: string): Promise<void> {
        await client.userAtActivity.delete({
            where: {
                id
            }
        })
    },
    async countByUserId(userId: string): Promise<number> {
        const count = await client.userAtActivity.count({
            where: {
                userId: userId,
                // Opcional: usar essa linha se quiser contar apenas inscrições
                // que não sejam em lista de espera.
                // listaEspera: false 
            },
        });
        return count;
    }
}