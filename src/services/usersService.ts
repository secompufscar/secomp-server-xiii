import * as jwt from "jsonwebtoken"
import * as nodemailer from "nodemailer"
import _ from "lodash"
import usersRepository from '../repositories/usersRepository';
import { compareSync, hashSync, hash } from 'bcrypt';
import { auth } from '../config/auth';
import { email } from '../config/sendEmail';
import { User } from "../entities/User";
import { ApiError, ErrorsCode } from "../utils/api-errors"
import { generateQRCode } from "../utils/qrCode";
import { CreateUserDTOS, UpdateUserDTOS, UpdateQrCodeUsersDTOS } from "../dtos/usersDtos";
import { promises as fs } from 'fs';
import path from 'path';

// Edite aqui o transportador de email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465', // true for 465 (SSL), false for 587 (TLS)
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
} as nodemailer.TransportOptions);

// Carrega o html do email
export async function loadTemplate(templateName: string, data: Record<string, string>) {
    const templatePath = path.join(__dirname, '..', 'views', templateName);
    let html = await fs.readFile(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        html = html.replace(regex, value);
    }

    return html;
}

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
        
        const token = jwt.sign(
            { userId: user.id}, 
            auth.secret_token,
            { expiresIn: "1h" }
        );         

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
        
        const token = jwt.sign(
            { userId: user.id}, 
            auth.secret_token,
            { expiresIn: "1h" }
        );   

        const { senha:_, ...userLogin } = user

        // Envia email de confirmação
        const emailEnviado = await this.sendConfirmationEmail(user)

        if (!emailEnviado) {
            await usersRepository.delete(user.id);
            throw new ApiError("Erro ao enviar email de confirmação!", ErrorsCode.INTERNAL_ERROR);
        }

        return {
            message: "Usuário criado com sucesso. Email de confirmação enviado.",
            emailEnviado
        };
    },

    async sendConfirmationEmail(user: User): Promise<boolean>  {
        try {
            const emailToken = jwt.sign(
                { userId: user.id},
                email.email_secret,
                { expiresIn: '1d' }
            )

            const BASE_URL =
                process.env.NODE_ENV === "production"
                    ? process.env.BASE_URL_PROD
                    : process.env.BASE_URL_DEV;

            const url = `${BASE_URL}/users/confirmation/${emailToken}`;

            const html = await loadTemplate('email-confirmation.html', {
                url
            });

            await transporter.sendMail( {
                to: user.email,
                subject: "SECOMP UFSCar - Confirmação de email",
                html,
            });
            
            console.log("Email enviado com sucesso")
            return true;
        }
        catch(err) {
            throw new ApiError(`Erro ao enviar email`, ErrorsCode.INTERNAL_ERROR)
        }
    },

    async confirmUser(token: string) {
        try {
            const decoded = jwt.verify(token, email.email_secret) as jwt.JwtPayload

            if(typeof decoded !== 'string' && decoded.userId) {
                const id = decoded.userId;

                const user = await usersRepository.update(id, { confirmed: true })
                const {senha:_, ...confirmedUser} = user

                return {
                    user: confirmedUser
                }
            }

            throw new Error("Token de confirmação inválido!")
        }
        catch(err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new ApiError("Token expirado. Solicite um novo.", ErrorsCode.UNAUTHORIZED);
            }
            throw new ApiError("Erro ao confirmar e-mail!", ErrorsCode.INTERNAL_ERROR);
        }
    },

    async sendForgotPasswordEmail(email: string) {
        try {
            const user = await usersRepository.findByEmail(email)
            if (!user) {
                throw new ApiError("Usuário não encontrado!", ErrorsCode.NOT_FOUND)
            }

            const emailToken = jwt.sign(
                { user: _.pick(user, 'id') },
                process.env.JWT_RESET_SECRET || "default_secret",
                { expiresIn: '1h' }
            )
            
            // Link com protocolo personalizado que é interpretado pelo app mobile
            const url = `https://secompapp.com/SetNewPassword?token=${emailToken}`;
            const html = await loadTemplate('email-passwordreset.html', {
                url
            });
            
            await transporter.sendMail( {
                to: user.email,
                subject: "SECOMP UFSCar - Solicitação de alteração de senha",
                html,
            });
        }
        catch(err) {
            console.log("Erro no serviço de recuperação de senha", err)
            throw new ApiError(
                "Erro ao enviar email de recuperação de senha!", 
                ErrorsCode.INTERNAL_ERROR
            )
        }
    },

    async updatePassword(token: string, newPassword: string) {
    try {
        // Verifica o token com a mesma chave usada na geração
        const decoded = jwt.verify(
            token,
            process.env.JWT_RESET_SECRET || "default_secret" 
        ) as { userId: string };

        // Busca o usuário pelo ID do token
        const user = await usersRepository.findById(decoded.userId);
        if (!user) {
            throw new ApiError("Usuário não encontrado", ErrorsCode.NOT_FOUND);
        }

        const hashedPassword = await hash(newPassword, 10);

        // Atualiza a senha no banco
        await usersRepository.update(user.id, { senha: hashedPassword });

        return { message: "Senha atualizada com sucesso" };

    } catch (err) {
        // Tratamento específico para erros do JWT
        if (err instanceof jwt.TokenExpiredError) {
            throw new ApiError("Token expirado", ErrorsCode.UNAUTHORIZED);
        }
        if (err instanceof jwt.JsonWebTokenError) {
            throw new ApiError("Token inválido", ErrorsCode.UNAUTHORIZED);
        }
        throw new ApiError("Erro ao atualizar senha", ErrorsCode.INTERNAL_ERROR);
    }
}
}