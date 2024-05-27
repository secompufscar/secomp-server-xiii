import {Request, Response} from 'express'
import { prismaClient } from '..';
import {hashSync, compareSync} from 'bcrypt';
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from '../secrets';
import { BadRequestsException } from '../exceptions/bad-requests';
import { ErrorCode } from '../exceptions/root';

export const signup = async (req: Request, res: Response) => {
    const {email, senha, nome}= req.body;

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

export const login = async (req: Request, res: Response) => {
    const {email, senha}= req.body;

    let user = await prismaClient.user.findFirst({where: {email}})

    if (!user) 
        throw Error("Usuário não existe")
    
    if (!compareSync(senha, user.senha))
        throw Error ("Senha incorreta")
    

    const token = jwt.sign({
        userId: user.id
    }, JWT_SECRET)

    res.json({user, token})
}