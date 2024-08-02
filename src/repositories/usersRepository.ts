import { PrismaClient } from "@prisma/client"

import { User } from "../entities/User"

import { CreateUserDTOS, UpdateUserDTOS } from "../dtos/usersDtos"

const client = new PrismaClient()

export default {
    async list(): Promise<User[]> {
        const response = await client.user.findMany()
        
        return response
    },

    async findById(id: string): Promise<User | null> {
        const response = await client.user.findFirst({
            where: {
                id
            }
        })

        return response
    },

    async findByEmail(email: string): Promise<User | null> {
        const response = await client.user.findFirst({
            where: {
                email
            }
        })

        return response
    },

    async create(data: CreateUserDTOS): Promise<User> {
        const response = await client.user.create({
            data
        })

        return response
    },

    async update(id: string, data: UpdateUserDTOS): Promise<User> {
        const response = await client.user.update({
            data,
            where: {
                id
            }
        })

        return response
    },

    async delete(id: string): Promise<void> {
        await client.user.delete({
            where: {
                id
            }
        })
    }
}