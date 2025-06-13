// src/middlewares/adminMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { BadRequestsException, UnauthorizedUserError, UserNotFoundError } from "../utils/exceptions";
//Importa tipo 'User' da entidade, não do Prisma, para ter os tipos corretos.
import { User } from "../entities/User";
// import { PrismaClient } from "@prisma/client"; 
import { auth } from "../config/auth";
import * as jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-errors";
import userRepository from "../repositories/usersRepository"; // Importamos o repositório.

type jwtPayload = {
    userId: string
};

// const prismaClient = new PrismaClient(); 
const JWT_SECRET = auth.secret_token;

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const { authorization } = req.headers;
        if (!authorization) {
            throw new UnauthorizedUserError("Não autorizado");
        }
        
        const token = authorization.split(' ')[1];
        const { userId } = jwt.verify(token, JWT_SECRET) as jwtPayload;

        if (!userId) {
            throw new BadRequestsException("Bad request");
        }

        // Usamos o repositório para buscar o usuário.
        
        const user = await userRepository.findById(userId);
        
        // Adicionado um check para caso o usuário não tenha sido encontrado no banco
        if (!user) {
            throw new UserNotFoundError("Usuário associado ao token não encontrado.");
        }

        // A verificação continua a mesma, mas agora sobre um objeto com tipo seguro.
        if (user.tipo !== "ADMIN") {
            throw new UnauthorizedUserError("Acesso restrito a administradores.");
        }

        // Se o usuário é admin, a requisição continua.
        next();
    }
    catch(error: any) {
        if (error instanceof ApiError)
            return res.status(error.statusCode).json({ message: error.message, statusCode: error.statusCode });
        else if (error instanceof jwt.TokenExpiredError)
            return res.status(401).json({ message: "Token expirado", statusCode: 401 });
        
        console.error("Erro em acesso administrativo: ", error);
        return res.status(500).json({ message: "Erro interno no servidor" });
    }
}