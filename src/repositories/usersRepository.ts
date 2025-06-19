import { PrismaClient } from "@prisma/client"

import { User } from "../entities/User"

import { CreateUserDTOS, UpdateQrCodeUsersDTOS, UpdateUserDTOS } from "../dtos/usersDtos"
import { prismaClient } from "@middlewares/authMiddleware"

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
    },
    async updateQRCode(id: string, data: UpdateQrCodeUsersDTOS): Promise<UpdateQrCodeUsersDTOS> {
        return await client.user.update({
            data,
            where: { id }
        });
    },

    async getUserRanking(id: string): Promise<Number>{

        //recebe os pontos do usuário com o id que estamos procurando
        const userPoints = await client.user.findUnique({
            where:{id},
            select:{points:true}
        })


        //verifica se o campo é válido
        if(!userPoints){
            throw new Error("User not found!");
        }

        //conta quantos usuários existem antes dele para determinar
        //seu ranking
        const rank = await client.user.count({
            where:{
                points:{
                    gt:userPoints.points,
                },
            },
        }) 
        return rank +1;
    }
}