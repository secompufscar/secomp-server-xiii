import {Request, Response} from 'express'
import { prismaClient } from '..';
import {hashSync, compareSync} from 'bcrypt';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from '../secrets';
import { BadRequestsException } from '../exceptions/bad-requests';
import { ErrorCode } from '../exceptions/root';

export const signup = async (req: Request, res: Response) => {
    const {email, senha, nome} = req.body

    try{
        let user = await prismaClient.user.findFirst({where: {email}})

        if (user) 
            throw new BadRequestsException('Usuário já existe', ErrorCode.USER_ALREADY_EXISTS)
        
        user = await prismaClient.user.create({
            data:{
                nome,
                email,
                senha: hashSync(senha, 10),
                tipo: 'USER'
            }
        })
        res.json(user)
    }
    catch(error) {
        console.error("Erro registrando novo usuário: ", error)
        res.status(400).json( { error: error })
    }
}

export const login = async (req: Request, res: Response) => {
    const {email, senha}= req.body;

    let user = await prismaClient.user.findFirst({where: {email}})

    try {
        let erro = ""
        if (!user) {
            erro = "Usuário não existe"
            throw new BadRequestsException(erro, ErrorCode.USER_NOT_FOUND)
        }
    
        if (!compareSync(senha, user.senha)) {
            erro = "Senha incorreta"
            throw new BadRequestsException(erro, ErrorCode.INCORRET_PASSWORD)
        }

        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET)
    
        res.json({ user })
    }
    catch(error) {
        console.error("Erro em login: ", error)
        res.status(400).json( { error: error })
    }

}