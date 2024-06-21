import {Request, Response} from 'express'
import { prismaClient } from '..';
import {hashSync, compareSync} from 'bcrypt';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from '../secrets';
import { BadRequestsException, IncorrectPasswordError,  UserNotFoundError, NoJWTSecretSpecifiedError } from '../exceptions/exceptions';

export const signup = async (req: Request, res: Response) => {
    const {email, senha, nome} = req.body

    try { 
        if(!JWT_SECRET) 
            throw new NoJWTSecretSpecifiedError('Chave JWT não identificada')

        let user = await prismaClient.user.findFirst({where: {email}})

        if (user) 
            throw new BadRequestsException('Usuário já existe')
        
        user = await prismaClient.user.create({
            data:{
                nome,
                email,
                senha: hashSync(senha, 10),
                tipo: 'USER'
            }
        })
        res.status(201).json(user)
    }
    catch(error: any) {
        console.error("Erro registrando novo usuário: ", error)
        res.status(error.statusCode).json( { message: error.message, statusCode: error.statusCode })
    }
}

export const login = async (req: Request, res: Response) => {
    const {email, senha}= req.body;
    console.log(JWT_SECRET)
    let user = await prismaClient.user.findFirst({where: {email}})

    try {
        if(!JWT_SECRET) 
            throw new NoJWTSecretSpecifiedError('Chave JWT não identificada')

        let erro = ""
        if (!user) {
            erro = "Usuário ou senha inválidos"
            throw new UserNotFoundError(erro)
        }
    
        const verifyPsw = await compareSync(senha, user.senha)
        if (!verifyPsw) {
            erro = "Usuário ou senha inválidos"
            throw new IncorrectPasswordError(erro)
        }

        const token = jwt.sign( { userId: user.id }, JWT_SECRET, {
            expiresIn: "2h"
        })
    
        const { senha:_, ...userLogin } = user
        res.status(200).json({ 
            user: userLogin,
            token: token
        })
    }
    catch(error: any) {
        console.error("Erro em login: ", error.message)
        res.status(error.statusCode).json( { message: error.message, statusCode: error.statusCode })
    }

}

export const getProfile = async(req: Request, res: Response) => {
    return res.json(req.user)
}