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
const activitiesRepository_1 = __importDefault(require("../repositories/activitiesRepository"));
const usersAtActivitiesRepository_1 = __importDefault(require("../repositories/usersAtActivitiesRepository"));
const api_errors_1 = require("../utils/api-errors");
exports.default = {
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const atividade = yield activitiesRepository_1.default.findById(id);
            if (!atividade) {
                throw new api_errors_1.ApiError('Atividade não encontrada', api_errors_1.ErrorsCode.NOT_FOUND);
            }
            return atividade;
        });
    },
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const activities = yield activitiesRepository_1.default.list();
            return activities;
        });
    },
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ nome, data, palestranteNome, categoriaId, vagas, detalhes }) {
            const newData = data ? new Date(data) : null;
            const newAtividade = yield activitiesRepository_1.default.create({
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
            const existingAtividade = yield activitiesRepository_1.default.findById(id);
            if (!existingAtividade) {
                throw new api_errors_1.ApiError('Atividade não encontrada', api_errors_1.ErrorsCode.NOT_FOUND);
            }
            const updatedAtividade = yield activitiesRepository_1.default.update(id, {
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
            const userAtActivities = yield usersAtActivitiesRepository_1.default.findManyByActivityId(id);
            if (userAtActivities.length > 0) {
                throw new api_errors_1.ApiError('Não é possível excluir esta atividade pois já possui associações de usuários.', api_errors_1.ErrorsCode.BAD_REQUEST);
            }
            yield activitiesRepository_1.default.delete(id);
        });
    }
};
