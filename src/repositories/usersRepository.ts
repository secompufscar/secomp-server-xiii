import { PrismaClient } from "@prisma/client"

import { User } from "../entities/User"

import { Prisma } from "@prisma/client"
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
    async getUserRanking(id: string): Promise<number> {
        const result = await client.$queryRaw<{ rank: number }[]>(
            Prisma.sql`
              SELECT COUNT(*) + 1 AS \`rank\`
              FROM (
                SELECT
                  u.id,
                  u.points,
                  COUNT(CASE WHEN ua.presente = 1 THEN 1 END) AS presences,
                  u.createdAt
                FROM \`users\` u
                LEFT JOIN \`userAtActivity\` ua ON ua.userId = u.id
                GROUP BY u.id, u.points, u.createdAt
              ) AS other_users
              WHERE (
                other_users.points > (
                  SELECT points FROM \`users\` WHERE id = ${id}
                )
                OR (
                  other_users.points = (
                    SELECT points FROM \`users\` WHERE id = ${id}
                  ) AND other_users.presences > (
                    SELECT COUNT(*) FROM \`userAtActivity\`
                    WHERE userId = ${id} AND presente = 1
                  )
                )
                OR (
                  other_users.points = (
                    SELECT points FROM \`users\` WHERE id = ${id}
                  ) AND other_users.presences = (
                    SELECT COUNT(*) FROM \`userAtActivity\`
                    WHERE userId = ${id} AND presente = 1
                  ) AND other_users.createdAt < (
                    SELECT createdAt FROM \`users\` WHERE id = ${id}
                  )
                )
              );
            `
          );
          
          

          if(result.length===0){
            throw new Error('não foi possivel recuperar o ranking')
          }
          return Number( result[0].rank);
          

    }

}