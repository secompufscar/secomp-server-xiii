import { PrismaClient } from "@prisma/client"

import { User } from "../entities/User"

const client = new PrismaClient()

export default {
    async list(): Promise<User[]> {
        const response = await client.user.findMany()
        
        return response
    },

    async findById(id: number): Promise<User> {
        const response = await client.user.findFirst({
            where: {
                id
            }
        })

        return response
    },

    async findByEmail(email: string): Promise<User> {
        const response = await client.user.findFirst({
            where: {
                email
            }
        })

        return response
    },

    async create(data: User): Promise<User> {
        const response = await client.user.create({
            data
        })

        return response
    },

    async update(id: number, data: User): Promise<User> {
        const response = await client.user.update({
            data,
            where: {
                id
            }
        })

        return response
    },

    async delete(id: number): Promise<void> {
        await client.user.delete({
            where: {
                id
            }
        })
    }
}