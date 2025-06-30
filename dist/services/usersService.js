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
exports.loadTemplate = loadTemplate;
const jwt = __importStar(require("jsonwebtoken"));
const nodemailer = __importStar(require("nodemailer"));
const lodash_1 = __importDefault(require("lodash"));
const usersRepository_1 = __importDefault(require("../repositories/usersRepository"));
const bcrypt_1 = require("bcrypt");
const auth_1 = require("../config/auth");
const sendEmail_1 = require("../config/sendEmail");
const api_errors_1 = require("../utils/api-errors");
const qrCode_1 = require("../utils/qrCode");
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
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
// Carrega o html do email
function loadTemplate(templateName, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const templatePath = path_1.default.join(__dirname, '..', 'views', templateName);
        let html = yield fs_1.promises.readFile(templatePath, 'utf-8');
        for (const [key, value] of Object.entries(data)) {
            const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
            html = html.replace(regex, value);
        }
        return html;
    });
}

function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}

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
            const qrCode = yield (0, qrCode_1.generateQRCode)(user.id);
            const updatedUser = yield usersRepository_1.default.updateQRCode(user.id, { qrCode });
            user.qrCode = qrCode;
            const token = jwt.sign({ userId: user.id }, auth_1.auth.secret_token, { expiresIn: "1h" });
            const { senha: _ } = user, userLogin = __rest(user
            // Envia email de confirmação
            , ["senha"]);
            // Envia email de confirmação
            const emailEnviado = yield this.sendConfirmationEmail(user);
            if (!emailEnviado) {
                yield usersRepository_1.default.delete(user.id);
                throw new api_errors_1.ApiError("Erro ao enviar email de confirmação!", api_errors_1.ErrorsCode.INTERNAL_ERROR);
            }
            return {
                message: "Usuário criado com sucesso. Email de confirmação enviado.",
                emailEnviado
            };
        });
    },
    sendConfirmationEmail(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const emailToken = jwt.sign({ userId: user.id }, sendEmail_1.email.email_secret, { expiresIn: '1d' });
                const BASE_URL = process.env.NODE_ENV === "production"
                    ? process.env.BASE_URL_PROD
                    : process.env.BASE_URL_DEV;
                const url = `${BASE_URL}/users/confirmation/${emailToken}`;
                const html = yield loadTemplate('email-confirmation.html', {
                    url
                });
                yield transporter.sendMail({
                    to: user.email,
                    subject: "SECOMP UFSCar - Confirmação de email",
                    html,
                });
                console.log("Email enviado com sucesso");
                return true;
            }
            catch (err) {
                throw new api_errors_1.ApiError(`Erro ao enviar email`, api_errors_1.ErrorsCode.INTERNAL_ERROR);
            }
        });
    },
    confirmUser(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = jwt.verify(token, sendEmail_1.email.email_secret);
                if (typeof decoded !== 'string' && decoded.userId) {
                    const id = decoded.userId;
                    const user = yield usersRepository_1.default.update(id, { confirmed: true });
                    const { senha: _ } = user, confirmedUser = __rest(user, ["senha"]);
                    return {
                        user: confirmedUser
                    };
                }
                throw new Error("Token de confirmação inválido!");
            }
            catch (err) {
                if (err instanceof jwt.TokenExpiredError) {
                    throw new api_errors_1.ApiError("Token expirado. Solicite um novo.", api_errors_1.ErrorsCode.UNAUTHORIZED);
                }
                throw new api_errors_1.ApiError("Erro ao confirmar e-mail!", api_errors_1.ErrorsCode.INTERNAL_ERROR);
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
                // Link com protocolo personalizado que é interpretado pelo app mobile
                const url = `https://secompapp.com/SetNewPassword?token=${emailToken}`;

                const html = yield loadTemplate('email-passwordreset.html', {
                    url
                });
                yield transporter.sendMail({
                    to: user.email,
                    subject: "SECOMP UFSCar - Solicitação de alteração de senha",
                    html,
                });
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
    },
    getUserScore(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userPoints = yield usersRepository_1.default.getUserPoints(id);
                if (!userPoints) {
                    throw new api_errors_1.ApiError("Usuário não encontrado.", api_errors_1.ErrorsCode.NOT_FOUND);
                }
                return userPoints; // Retorna { points: number }
            }
            catch (error) {
                console.error('Erro em usersService.getUserScore: ' + error);
                throw new api_errors_1.ApiError('Erro ao obter pontuação do usuário', api_errors_1.ErrorsCode.INTERNAL_ERROR);
            }
        });
    },
    getUserRanking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRank = yield usersRepository_1.default.getUserRanking(id);
                return userRank;
            }
            catch (error) {
                console.error('Erro usersService.ts: ' + error);
                throw new api_errors_1.ApiError('erro ao encontrar ranking do usuário', api_errors_1.ErrorsCode.NOT_FOUND);
            }
        });
    },
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //verifica se o id enviado não está errado
                if (!isValidUUID(id)) {
                    throw new api_errors_1.ApiError('erro com o id enviado', api_errors_1.ErrorsCode.BAD_REQUEST);
                }
                const user = yield usersRepository_1.default.findById(id);
                if (!user) {
                    throw new api_errors_1.ApiError('erro ao encontrar usuário: ', api_errors_1.ErrorsCode.NOT_FOUND);
                }
                return user;
            }
            catch (error) {
                console.error('usersService.ts: ' + error);
                throw new Error('erro ao encontrar usuário por id');
            }
        });
    },
    updateProfile(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nome, email } = data;
            // Garante que o corpo da requisição não está vazio.
            if (!nome && !email) {
                throw new api_errors_1.ApiError("A requisição deve conter 'nome' ou 'email' para ser atualizado.", api_errors_1.ErrorsCode.BAD_REQUEST);
            }
            // Valida o formato do email, se ele for fornecido.
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    throw new api_errors_1.ApiError("O formato do email é inválido.", api_errors_1.ErrorsCode.BAD_REQUEST);
                }
            }
            const userToUpdate = yield usersRepository_1.default.findById(userId);
            if (!userToUpdate) {
                throw new api_errors_1.ApiError("Usuário não encontrado.", api_errors_1.ErrorsCode.NOT_FOUND);
            }
            // Verifica se o novo e-mail já está em uso por outro usuário.
            if (email && email !== userToUpdate.email) {
                const userWithSameEmail = yield usersRepository_1.default.findByEmail(email);
                if (userWithSameEmail && userWithSameEmail.id !== userId) {
                    throw new api_errors_1.ApiError("Este e-mail já está em uso.", api_errors_1.ErrorsCode.BAD_REQUEST);
                }
            }
            const updatedUser = yield usersRepository_1.default.update(userId, { nome, email });
            // Remove a senha do retorno por segurança.
            const { senha: _ } = updatedUser, userResult = __rest(updatedUser, ["senha"]);
            return userResult;
        });
    },
};
