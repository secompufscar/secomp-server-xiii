import * as jwt from "jsonwebtoken"
import * as nodemailer from "nodemailer"
import _ from "lodash"
import { compareSync, hashSync } from 'bcrypt';
import usersRepository from '../repositories/usersRepository';
import { auth } from '../config/auth';
import { email } from '../config/sendEmail';
import { User } from "../entities/User";
import { ApiError, ErrorsCode } from "../utils/api-errors"
import { generateQRCode } from "../utils/qrCode";
import { CreateUserDTOS, UpdateUserDTOS, UpdateQrCodeUsersDTOS } from "../dtos/usersDtos";
import { BadRequestsException } from "../utils/exceptions";

export default {
    async login({ email, senha }: User) {
        const user = await usersRepository.findByEmail(email)

        if(!user?.confirmed) {
            throw new ApiError("E-mail ainda não verificado", ErrorsCode.BAD_REQUEST)
        }
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

    async signup({ nome, email, senha, tipo = 'USER'}: CreateUserDTOS) {
        const userExists = await usersRepository.findByEmail(email)

        if (userExists) {
            throw new ApiError("Usuario já existe", ErrorsCode.BAD_REQUEST)
        }
        
        const user = await usersRepository.create({
            nome,
            email,
            senha: hashSync(senha, 10),
            tipo,
        })

        const qrCode = await generateQRCode(user.id);
        const updatedUser = await usersRepository.updateQRCode(user.id, {qrCode});
        
        const token = jwt.sign( { userId: user.id }, auth.secret_token, {
            expiresIn: auth.expires_in_token
        })
        
        const { senha:_, ...userLogin } = user

        // Envia email
        this.sendEmail(user)
        
        //return updatedUser

        return { 
            user: userLogin,
            token: token
        }    
    },

    async sendEmail(user: User) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: email.email_address,
                pass: email.email_password
            }
        })

        try {
            const emailToken = jwt.sign(
                { user: _.pick(user, 'id') },
                email.email_secret,
                { expiresIn: '1d' }
            )

            const url = `http://localhost:3000/api/v1/users/confirmation/${emailToken}`

            await transporter.sendMail( {
                to: user.email,
                subject: "Confirme seu email",
                html: `Clique <a href="${url}>aqui</a> para confirmar seu email`
            } )

            console.log("Email enviado com sucesso")
        }
        catch(err) {
            console.error()
        }
    },

    async confirmUser(token: string) {
        try {
            const decoded = jwt.verify(token, email.email_secret) as jwt.JwtPayload

            if(typeof decoded !== 'string' && decoded.user) {
                const { user: { id } } = decoded

                const user = await usersRepository.update(id, { confirmed: true })
                const {senha:_, ...confirmedUser} = user

                return {
                    user: confirmedUser
                }
            }

        }
        catch(err) {
            throw new BadRequestsException("BRUH")
        }
    }
}