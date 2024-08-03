import { UnauthorizedUserError } from '../utils/exceptions';
import { NextFunction, Request, Response } from 'express';
import { auth } from '../config/auth';
import jwt from 'jsonwebtoken'
import usersService from '../services/usersService';

type jwtPayload = {
    userId: string
}
export async function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const { authorization } = req.headers
    const JWT_SECRET = auth.secret_token

    if(!authorization) 
        throw new UnauthorizedUserError("Não autorizado")

    const token = authorization.split(' ')[1]
    
    try {
        const { userId } = jwt.verify(token, JWT_SECRET) as jwtPayload 
        const user = await usersService.findById(userId)

        const { ...loggedUser } = user
        req.user = loggedUser
        next();
    }
    catch(error: any) {
        throw new UnauthorizedUserError("Token inválido")
    }
}