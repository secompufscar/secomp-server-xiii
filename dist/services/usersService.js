"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = __importStar(require("jsonwebtoken"));
const nodemailer = __importStar(require("nodemailer"));
const lodash_1 = __importDefault(require("lodash"));
const bcrypt_1 = require("bcrypt");
const usersRepository_1 = __importDefault(require("../repositories/usersRepository"));
const auth_1 = require("../config/auth");
const sendEmail_1 = require("../config/sendEmail");
const api_errors_1 = require("../utils/api-errors");
// Edite aqui o transportador de email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === '465', // true for 465 (SSL), false for 587 (TLS)
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
exports.default = {
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, senha }) {
            const user = yield usersRepository_1.default.findByEmail(email);
            if (!user) {
                throw new api_errors_1.ApiError("Email ou senha incorreto!", api_errors_1.ErrorsCode.NOT_FOUND);
            }
            const verifyPsw = (0, bcrypt_1.compareSync)(senha, user.senha);
            if (!verifyPsw) {
                throw new api_errors_1.ApiError("Email ou senha incorreto!", api_errors_1.ErrorsCode.NOT_FOUND);
            }
            if (!user.confirmed) {
                throw new api_errors_1.ApiError("Por favor, verifique o seu email e tente novamente!", api_errors_1.ErrorsCode.BAD_REQUEST);
            }
            const token = jwt.sign({ userId: user.id }, auth_1.auth.secret_token, { expiresIn: "1h" });
            const { senha: _ } = user, userLogin = __rest(user, ["senha"]);
            return {
                user: userLogin,
                token: token
            };
        });
    },
    signup(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nome, email, senha, tipo = 'USER' }) {
            const userExists = yield usersRepository_1.default.findByEmail(email);
            if (userExists) {
                throw new api_errors_1.ApiError("Este email já existe na base de dados!", api_errors_1.ErrorsCode.BAD_REQUEST);
            }
            const user = yield usersRepository_1.default.create({
                nome,
                email,
                senha: (0, bcrypt_1.hashSync)(senha, 10),
                tipo,
            });
            // const qrCode = await generateQRCode(user.id);
            // const updatedUser = await usersRepository.updateQRCode(user.id, {qrCode});
            // user.qrCode = qrCode
            const token = jwt.sign({ userId: user.id }, auth_1.auth.secret_token, { expiresIn: "1h" });
            const { senha: _ } = user, userLogin = __rest(user
            // Envia email de confirmação
            , ["senha"]);
            // Envia email de confirmação
            const emailEnviado = this.sendConfirmationEmail(user);
            //return updatedUser
            return emailEnviado;
        });
    },
    sendConfirmationEmail(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emailToken = jwt.sign({ user: lodash_1.default.pick(user, 'id') }, sendEmail_1.email.email_secret, { expiresIn: '1d' });
                const url = `https://api.secompufscar.com.br/api/v1/users/confirmation/${emailToken}`;
                yield transporter.sendMail({
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
                });
                console.log("Email enviado com sucesso");
                return true;
            }
            catch (err) {
                throw new api_errors_1.ApiError(`Erro ao enviar email`, api_errors_1.ErrorsCode.INTERNAL_ERROR);
                return false;
            }
        });
    },
    confirmUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jwt.verify(token, sendEmail_1.email.email_secret);
                if (typeof decoded !== 'string' && decoded.user) {
                    const { user: { id } } = decoded;
                    const user = yield usersRepository_1.default.update(id, { confirmed: true });
                    const { senha: _ } = user, confirmedUser = __rest(user, ["senha"]);
                    return {
                        user: confirmedUser
                    };
                }
                throw new Error("Token de confirmação inválido!");
            }
            catch (err) {
                throw new api_errors_1.ApiError(`Erro ao confirmar e-mail!`, api_errors_1.ErrorsCode.INTERNAL_ERROR);
            }
        });
    },
    sendForgotPasswordEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield usersRepository_1.default.findByEmail(email);
                if (!user) {
                    throw new api_errors_1.ApiError("Usuário não encontrado!", api_errors_1.ErrorsCode.NOT_FOUND);
                }
                const emailToken = jwt.sign({ user: lodash_1.default.pick(user, 'id') }, process.env.JWT_RESET_SECRET || "default_secret", { expiresIn: '1h' });
                // No servidor
                // const url = `https://secompapp.com/SetNewPassword?token=${emailToken}`//`https://api.secompufscar.com.br/api/v1/users/updatePassword/${emailToken}`
                // Envio de e-mail localmente
                const url = `secompapp://SetNewPassword?token=${emailToken}`; //`https://api.secompufscar.com.br/api/v1/users/updatePassword/${emailToken}`
                yield transporter.sendMail({
                    to: user.email,
                    subject: "Redefinição de Senha - SECOMP UFSCar", // Assunto mais claro
                    html: `
                    <h1>Olá, ${user.nome}</h1>
                    <p>Clique no link abaixo para redefinir sua senha:</p>
                    <a href="${url}">${url}</a>
                    <p><i>Link válido por 1 hora</i></p>
                `
                });
                //para teste
                console.log(emailToken);
            }
            catch (err) {
                console.log("Erro no serviço de recuperação de senha", err);
                throw new api_errors_1.ApiError("Erro ao enviar email de recuperação de senha!", api_errors_1.ErrorsCode.INTERNAL_ERROR);
            }
        });
    },
    updatePassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verifica o token com a mesma chave usada na geração
                const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET || "default_secret");
                // Busca o usuário pelo ID do token
                const user = yield usersRepository_1.default.findById(decoded.userId);
                if (!user) {
                    throw new api_errors_1.ApiError("Usuário não encontrado", api_errors_1.ErrorsCode.NOT_FOUND);
                }
                const hashedPassword = yield (0, bcrypt_1.hash)(newPassword, 10);
                // Atualiza a senha no banco
                yield usersRepository_1.default.update(user.id, { senha: hashedPassword });
                return { message: "Senha atualizada com sucesso" };
            }
            catch (err) {
                // Tratamento específico para erros do JWT
                if (err instanceof jwt.TokenExpiredError) {
                    throw new api_errors_1.ApiError("Token expirado", api_errors_1.ErrorsCode.UNAUTHORIZED);
                }
                if (err instanceof jwt.JsonWebTokenError) {
                    throw new api_errors_1.ApiError("Token inválido", api_errors_1.ErrorsCode.UNAUTHORIZED);
                }
                throw new api_errors_1.ApiError("Erro ao atualizar senha", api_errors_1.ErrorsCode.INTERNAL_ERROR);
            }
        });
    }
};
