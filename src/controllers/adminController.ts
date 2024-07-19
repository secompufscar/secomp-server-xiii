import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { hashSync } from "bcrypt";

import { JWT_SECRET } from '../../secrets'

import { BadRequestsException, NoJWTSecretSpecifiedError } from "../../exceptions/exceptions";

import atividadeService from "../services/atividadeService.js"

export default {
    async create(request, response) {
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
    },

    async update(request, response) {
        const { email, updatedEmail, nome, senha, tipo } = req.body
        const { authorization } = req.headers
        console.log(authorization)
    
        try {
            if(!JWT_SECRET)
                throw new NoJWTSecretSpecifiedError("Chave JWT não especificada")
    
            let user = await prismaClient.user.findUnique({ where: {email} })
    
            if(!user)
                throw new BadRequestsException("Email não existe")
    
            user = await prismaClient.user.update( {
                where: {email},
                data: {
                    email: updatedEmail ?? updatedEmail,
                    nome: nome ?? nome,
                    senha: senha ?? hashSync(senha, 10)
                }
            } )
    
            res.status(201).json(user)
        }
        catch(error: any) {
            console.log("Erro em update de usuário: ", error.message)
            res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode })
        }
    },

    async delete(request, response) {
        const { email } = req.body

        try {
            if(!JWT_SECRET)
                throw new NoJWTSecretSpecifiedError("Chava JWT não especificada")
    
            let user = await prismaClient.user.findFirst({ where: { email } })
    
            if(!user)
                throw new BadRequestsException("Email não existe")
    
            user = await prismaClient.user.delete({ where: email })
    
            res.status(201).json(user)
        }
        catch(error: any) {
            console.log("Erro deletando usuário: ", error.message)
            res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode })
        }
    }
}