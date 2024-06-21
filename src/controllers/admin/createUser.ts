import {Request, Response} from 'express'
import { JWT_SECRET } from '../../secrets'
import { BadRequestsException, NoJWTSecretSpecifiedError } from '../../exceptions/exceptions'
import { prismaClient } from '../..'
import { hashSync } from 'bcrypt'

export const createUser = async (req: Request, res: Response) => {
    const { email, senha, nome, tipo } = req.body
    const { authorization } = req.headers
    console.log("BRUH: ", authorization)
    console.log(JWT_SECRET)
    try {
        if(!JWT_SECRET)
            throw new NoJWTSecretSpecifiedError("Chave JWT não especificada")

        if(tipo !== "USER" && tipo !== "ADMIN")
            throw new BadRequestsException("Tipo de usuário não reconhecido")

        let user = await prismaClient.user.findFirst( { where: {email} } )

        if(user) {
            throw new BadRequestsException("Email já cadastrado")
        }

        user = await prismaClient.user.create({
            data: {
                email,
                senha: hashSync(senha, 10),
                nome,
                tipo
            }
        })

        res.status(201).json(user)
    } 
    catch(error: any) {
        console.error("Erro criando usuário: ", error.message)
        res.status(error.statusCode).json({ error: error.message, statusCode: error.statusCode })
    }
}