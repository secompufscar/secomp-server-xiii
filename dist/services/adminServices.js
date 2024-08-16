"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const usersRepository_1 = __importDefault(require("../repositories/usersRepository"));
exports.default = {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersRepository_1.default.findById(id);
            return user;
        });
    },
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersRepository_1.default.findByEmail(email);
            return user;
        });
    },
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield usersRepository_1.default.list();
        });
    },
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nome, email, senha, tipo }) {
            const user = yield usersRepository_1.default.create({
                nome,
                email,
                senha,
                tipo
            });
            return user;
        });
    },
    update(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nome, email, senha, tipo }) {
            const user = yield usersRepository_1.default.update(id, { nome, email, senha, tipo });
            return user;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield usersRepository_1.default.delete(id);
            return user;
        });
    }
};
