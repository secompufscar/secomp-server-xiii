import { PrismaClient } from "@prisma/client"

import { User } from "../entities/User"

import { CreateUserDTOS, UpdateQrCodeUsersDTOS, UpdateUserDTOS, UserDTOS } from "../dtos/usersDtos"

const client = new PrismaClient()

export default {
    async list(): Promise<UserDTOS[]> {
        const response = await client.user.findMany()
        
        return response
    },

    async findById(id: string): Promise<UserDTOS | null> {
        const response = await client.user.findFirst({
            where: {
                id
            }
        })
        console.log(`id: ${id}`)
        console.log(`findById [usersRepository]: ${JSON.stringify(response, null, 2)}`)
        return response
    },

    async findByEmail(email: string): Promise<UserDTOS | null> {
        const response = await client.user.findFirst({
            where: {
                email
            }
        })

        return response
    },

    async create(data: CreateUserDTOS): Promise<CreateUserDTOS> {
        const response = await client.user.create({
            data
        })

        return response
    },

    async update(id: string, data: UpdateUserDTOS): Promise<UpdateUserDTOS> {
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
    },
    async updateQRCode(id: string, data: UpdateQrCodeUsersDTOS): Promise<UpdateQrCodeUsersDTOS> {
        const updateData: any = {};

        if (data.qrCode !== undefined) {
            updateData.qrCode = data.qrCode; // Pode ser `string` ou `null`, mas Prisma pode não aceitar `null`
        }
    
        return await client.user.update({
            data: updateData,
            where: { id }
        });
    },
}