import * as jwt from "jsonwebtoken"
import { compareSync, hashSync } from 'bcrypt';
import usersRepository from '../repositories/usersRepository';
import { auth } from '../config/auth';
import { User } from "../entities/User";
import { ApiError, ErrorsCode } from "../utils/api-errors"
import { generateQRCode } from "../utils/qrCode";
import { CreateUserDTOS, UpdateUserDTOS, UpdateQrCodeUsersDTOS } from "../dtos/usersDtos";

export default {
    async login({ email, senha }: User) {
        const user = await usersRepository.findByEmail(email)

        if (!user) {
            throw new ApiError("Usuario ou senha invalida", ErrorsCode.NOT_FOUND)
        }
    
        const verifyPsw = compareSync(senha, user.senha)
        
        if (!verifyPsw) {
            throw new ApiError("Usuario ou senha invalida", ErrorsCode.NOT_FOUND)
        }

        const token = jwt.sign( { userId: user.id }, auth.secret_token, {
            expiresIn: auth.expires_in_token
        })
    
        const { senha:_, ...userLogin } = user
        
        return { 
            user: userLogin,
            token: token
        }
    },

    async signup({ nome, email, senha }: CreateUserDTOS) {
        const userExists = await usersRepository.findByEmail(email)

        if (userExists) {
            throw new ApiError("Usuario já existe", ErrorsCode.BAD_REQUEST)
        }
        
        const user = await usersRepository.create({
            nome,
            email,
            senha: hashSync(senha, 10),
            tipo: 'USER',
   
        })

        const qrCode = await generateQRCode(user.id);
        const updatedUser = await usersRepository.updateQRCode(user.id, {qrCode});

        return updatedUser
    }



}