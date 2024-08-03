import { Request, Response } from 'express';
import { hashSync } from "bcrypt";
import { auth } from "../config/auth"
import { BadRequestsException, NoJWTSecretSpecifiedError, UserNotFoundError } from "../utils/exceptions"
import adminServices from '../services/adminServices';

export default {

    async create(req: Request, res: Response) {
        const { email, senha, nome, tipo } = req.body
        const { authorization } = req.headers
        const JWT_SECRET = auth.secret_token
        
        try {
            if(!JWT_SECRET)
                throw new NoJWTSecretSpecifiedError("Chave JWT não especificada")
            
            if(!authorization) 
                throw new BadRequestsException("Acesso negado")

            if(tipo !== "USER" && tipo !== "ADMIN")
                throw new BadRequestsException("Tipo de usuário não reconhecido")
    
            let user = await adminServices.findByEmail(email)
    
            if(user) {
                throw new BadRequestsException("Email já cadastrado")
            }
    
            await adminServices.create( { nome, email, senha: hashSync(senha, 10), tipo } )
            user = await adminServices.findByEmail(email)

            res.status(201).json(user)
        } 
        catch(error: any) {
            console.error("Erro criando usuário: ", error.message)
            res.status(error.statusCode).json({ error: error.message, statusCode: error.statusCode })
        }
    },

    async update(req: Request, res: Response) {
        const { id, email, nome, senha, tipo } = req.body
        const { authorization } = req.headers
        const JWT_SECRET = auth.secret_token
    
        try {
            if(!JWT_SECRET)
                throw new NoJWTSecretSpecifiedError("Chave JWT não especificada")

            if(!authorization) 
                throw new BadRequestsException("Acesso negado")

            let user = await adminServices.findById(id)

            if(!user) {
                throw new UserNotFoundError("Usuário não encontrado")
            }
            
            await adminServices.update(id, { nome, email, senha, tipo })
            
            user = await adminServices.findById(id)
            res.status(201).json(user)
        }
        catch(error: any) {
            console.log("Erro em update de usuário: ", error.message)
            res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode })
        }
    },

    async delete(req: Request, res: Response) {
        const { id } = req.body
        const JWT_SECRET = auth.secret_token

        try {
            if(!JWT_SECRET)
                throw new NoJWTSecretSpecifiedError("Chave JWT não especificada")
    
            let user = await adminServices.findById(id)
    
            if(!user)
                throw new BadRequestsException("ID de usuário não existe")
    
            await adminServices.delete(user.id ? user.id : "")
    
            res.status(201).json(user)
        }
        catch(error: any) {
            console.log("Erro deletando usuário: ", error.message)
            res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode })
        }
    }
}