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
const diretoriasRepository_1 = __importDefault(require("../repositories/diretoriasRepository"));
exports.default = {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const diretoria = yield diretoriasRepository_1.default.findById(id);
            if (!diretoria) {
                throw new Error('Atividade não encontrada');
            }
            return diretoria;
        });
    },
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const diretorias = yield diretoriasRepository_1.default.list();
            return diretorias;
        });
    },
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nome, data, palestranteNome, categoriaId, vagas, detalhes }) {
            const newData = data ? new Date(data) : null;
            const newAtividade = yield diretoriasRepository_1.default.create({
                nome,
                data: newData,
                palestranteNome,
                categoriaId,
                vagas,
                detalhes
            });
            return newAtividade;
        });
    },
    update(id_1, _a) {
        return __awaiter(this, arguments, void 0, function* (id, { nome, data, palestranteNome, categoriaId }) {
            const existingAtividade = yield diretoriasRepository_1.default.findById(id);
            if (!existingAtividade) {
                throw new Error('Atividade não encontrada');
            }
            const updatedAtividade = yield diretoriasRepository_1.default.update(id, {
                nome,
                data,
                palestranteNome,
                categoriaId
            });
            return updatedAtividade;
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userAtActivities = yield usersAtdiretoriasRepository.findByActivityId(id);
            if (userAtActivities.length > 0) {
                throw new Error('Não é possível excluir esta atividade pois já possui associações de usuários.');
            }
            yield diretoriasRepository_1.default.delete(id);
        });
    }
};
