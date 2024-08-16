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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const bcrypt_1 = require("bcrypt");
const usersRepository_1 = __importDefault(require("../repositories/usersRepository"));
const auth_1 = require("../config/auth");
const api_errors_1 = require("../utils/api-errors");
const qrCode_1 = require("../utils/qrCode");
exports.default = {
    login(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, senha }) {
            const user = yield usersRepository_1.default.findByEmail(email);
            if (!user) {
                throw new api_errors_1.ApiError("Usuario ou senha invalida", api_errors_1.ErrorsCode.NOT_FOUND);
            }
            const verifyPsw = (0, bcrypt_1.compareSync)(senha, user.senha);
            if (!verifyPsw) {
                throw new api_errors_1.ApiError("Usuario ou senha invalida", api_errors_1.ErrorsCode.NOT_FOUND);
            }
            const token = jwt.sign({ userId: user.id }, auth_1.auth.secret_token, {
                expiresIn: auth_1.auth.expires_in_token
            });
            const { senha: _ } = user, userLogin = __rest(user, ["senha"]);
            return {
                user: userLogin,
                token: token
            };
        });
    },
    signup(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nome, email, senha }) {
            const userExists = yield usersRepository_1.default.findByEmail(email);
            if (userExists) {
                throw new api_errors_1.ApiError("Usuario já existe", api_errors_1.ErrorsCode.BAD_REQUEST);
            }
            const user = yield usersRepository_1.default.create({
                nome,
                email,
                senha: (0, bcrypt_1.hashSync)(senha, 10),
                tipo: 'USER',
            });
            const qrCode = yield (0, qrCode_1.generateQRCode)(user.id);
            const updatedUser = yield usersRepository_1.default.updateQRCode(user.id, { qrCode });
            return updatedUser;
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersRepository_1.default.findById(id);
            console.log(`findById [usersService]: ${JSON.stringify(user, null, 2)}`);
            return user;
        });
    },
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersRepository_1.default.findByEmail(email);
            return user;
        });
    },
};
