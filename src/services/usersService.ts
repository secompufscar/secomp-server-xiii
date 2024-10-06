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

// Edite aqui o transportador de email
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: email.email_address,
        pass: email.email_password
    }
})

export default {
    async login({ email, senha }: User) {
        const user = await usersRepository.findByEmail(email)

        if (!user) {
            throw new ApiError("Email ou senha incorreto!", ErrorsCode.NOT_FOUND)
        }
    
        const verifyPsw = compareSync(senha, user.senha)
        
        if (!verifyPsw) {
            throw new ApiError("Email ou senha incorreto!", ErrorsCode.NOT_FOUND)
        }

        if(!user.confirmed) {
            throw new ApiError("Por favor, verifique o seu email e tente novamente!", ErrorsCode.BAD_REQUEST)
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
            throw new ApiError("Este email já existe na base de dados!", ErrorsCode.BAD_REQUEST)
        }
        
        const user = await usersRepository.create({
            nome,
            email,
            senha: hashSync(senha, 10),
            tipo,
        })

        const qrCode = await generateQRCode(user.id);
        const updatedUser = await usersRepository.updateQRCode(user.id, {qrCode});
        user.qrCode = qrCode
        
        const token = jwt.sign( { userId: user.id }, auth.secret_token, {
            expiresIn: auth.expires_in_token
        })

        const { senha:_, ...userLogin } = user

        // Envia email de confirmação
        const emailEnviado = this.sendConfirmationEmail(user)
        
        //return updatedUser

        return emailEnviado;
    },

    async sendConfirmationEmail(user: User): Promise<boolean>  {
        try {
            const emailToken = jwt.sign(
                { user: _.pick(user, 'id') },
                email.email_secret,
                { expiresIn: '1d' }
            )

            const url = `https://api.secompufscar.com.br/api/v1/users/confirmation/${emailToken}`

            await transporter.sendMail( {
                to: user.email,
                subject: "Confirme seu email",
                html: `
                    <div style=" background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
                        <div style="margin-bottom: 20px;">
                            <img src="https://i.imgur.com/n61bSCd.png" alt="Logo" style="max-width: 200px;">
                        </div>
                        <h2 style="color: #333;">Olá ${user.nome}!</h2>
                        <p>Clique <a href="${url}" style="color: #007BFF; text-decoration: none; font-weight: bold;">aqui</a> para confirmar seu email.</p>
                    </div>
                `
            } )

            console.log("Email enviado com sucesso")
            return true;
        }
        catch(err) {
            throw new ApiError(`Erro ao enviar email: ${err}`, ErrorsCode.INTERNAL_ERROR)
            return false;
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

            throw new Error("Usuário não reconhecido")
        }
        catch(err) {
            throw new ApiError(`Erro ao confirmar e-mail: ${err}`, ErrorsCode.INTERNAL_ERROR)
        }
    },

    async sendForgotPasswordEmail(user: User) {
        try {
            const emailToken = jwt.sign(
                { user: _.pick(user, 'id') },
                email.email_secret,
                { expiresIn: '1d' }
            )

            const url = `https://api.secompufscar.com.br/api/v1/users/updatePassword/${emailToken}`

            await transporter.sendMail( {
                to: user.email,
                subject: "Atulização de senha",
                html: `<h1>Olá, ${user.nome}</h1>
                Parece que você esqueceu a sua senha.
                Clique <a href="${url}">aqui</a> para alterar sua senha`
            } )
            console.log("Email enviado com sucesso")
        }
        catch(err) {
            throw new ApiError(`Erro ao enviar email: ${err}`, ErrorsCode.INTERNAL_ERROR)
        }
    },

    async updatePassword(token: string) {
        // TODO: esse método é acessado após o usuário clicar no link de email. Talvez seja mais
        // interessante redirecionar o usuário para uma página de alteração de senha
        try {
            const decoded = jwt.verify(token, email.email_secret) as jwt.JwtPayload

            if(typeof decoded !== 'string' && decoded.user) {
                const { user: { id, senha } } = decoded

                const user = await usersRepository.update(id, { senha: senha })
                const {senha:_, ...confirmedUser} = user

                return {
                    user: confirmedUser
                }
            }

        }
        catch(err) {
            throw new ApiError("Erro ao confirmar e-mail", ErrorsCode.INTERNAL_ERROR)
        }
    }
}