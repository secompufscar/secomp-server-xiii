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
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    }
} as nodemailer.TransportOptions)

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

        // const qrCode = await generateQRCode(user.id);
        // const updatedUser = await usersRepository.updateQRCode(user.id, {qrCode});
        // user.qrCode = qrCode
        
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
                        <h2 style="color: #333;">Olá, ${user.nome}!</h2>
                        <p>Clique <a href="${url}" style="color: #007BFF; text-decoration: none; font-weight: bold;">aqui</a> para confirmar seu email.</p>
                    </div>
                `
            } )

            console.log("Email enviado com sucesso")
            return true;
        }
        catch(err) {
            throw new ApiError(`Erro ao enviar email`, ErrorsCode.INTERNAL_ERROR)
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

            throw new Error("Token de confirmação inválido!")
        }
        catch(err) {
            throw new ApiError(`Erro ao confirmar e-mail!`, ErrorsCode.INTERNAL_ERROR)
        }
    },

    async sendForgotPasswordEmail(email: string) {
        try {
            const user = await usersRepository.findByEmail(email)
            if (!user) {
                throw new ApiError("Usuário não encontrado!", ErrorsCode.NOT_FOUND)
            }

            const emailToken = jwt.sign(
                //{ userId: user.id}, 
                //process.env.JWT_RESET_SECRET || "default_secret",
                //{ expiresIn: '1H' }
                //Versão a baixo para teste local
                { userId: user.id}, 
                process.env.JWT_RESET_SECRET || "default_secret",
                { expiresIn: '1H' }
            )

            const url = `https://api.secompufscar.com.br/api/v1/users/updatePassword/${emailToken}`

            await transporter.sendMail({
                to: user.email,
                subject: "Redefinição de Senha - SECOMP UFSCar", // Assunto mais claro
                html: `
                    <h1>Olá, ${user.nome}</h1>
                    <p>Clique no link abaixo para redefinir sua senha:</p>
                    <a href="${url}">${url}</a>
                    <p><i>Link válido por 1 hora</i></p>
                `
            })
        }
        catch(err) {
            console.log("Erro no serviço de recuperação de senha", err)
            throw new ApiError(
                "Erro ao enviar email de recuperação de senha!", 
                ErrorsCode.INTERNAL_ERROR
            )
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
            throw new ApiError("Erro ao confirmar e-mail!", ErrorsCode.INTERNAL_ERROR)
        }
    }
}