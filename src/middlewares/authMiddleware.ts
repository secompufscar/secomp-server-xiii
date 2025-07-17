// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { UnauthorizedUserError } from "../utils/exceptions";
// Importa o tipo 'User' da entidade, não do Prisma
import { User } from "../entities/User";
// import { PrismaClient } from "@prisma/client";
import { JWT_SECRET } from "../secrets";
import * as jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-errors";
import userRepository from "../repositories/usersRepository"; // Importa o repositório

type jwtPayload = {
  userId: string;
};

// export const prismaClient = new PrismaClient();

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new UnauthorizedUserError("Não autorizado");
    }

    const token = authorization.split(" ")[1];
    const { userId } = jwt.verify(token, JWT_SECRET) as jwtPayload;

    // usa o repositório para buscar o usuário.
    const user = await userRepository.findById(userId);

    if (!user) {
      // Adicionado um check para caso o usuário não exista mais
      throw new UnauthorizedUserError("Usuário não encontrado.");
    }

    if (!user.confirmed) {
      throw new UnauthorizedUserError("Confirme o seu Email");
    }

    const { senha: _, ...loggedUser } = user;

    (req as any).user = loggedUser;

    next();
  } catch (error: any) {
    if (error instanceof ApiError)
      return res
        .status(error.statusCode)
        .json({ message: error.message, statusCode: error.statusCode });
    else if (error instanceof jwt.TokenExpiredError)
      return res.status(401).json({ message: "Token expirado", statusCode: 401 });

    console.error("Erro em acesso: ", error);

    return res.status(500).json({ message: "Erro interno no servidor" });
  }

}
export async function isAdmin(req: Request, res: Response, next: NextFunction) {
  // Assuming `authMiddleware` has already run and attached `req.user`
  const user = (req as any).user as Omit<User, 'senha'>; // Cast to the expected type

  if (user && user.tipo && user.tipo.toUpperCase() === 'ADMIN') { // Check if 'tipo' exists and is 'ADMIN'
    next(); // User is an ADMIN, allow access
  } else {
    // If user is not an ADMIN, send a 403 Forbidden response
    return res.status(403).json({ message: "Acesso negado: Somente administradores podem acessar este recurso." });
  }
}
