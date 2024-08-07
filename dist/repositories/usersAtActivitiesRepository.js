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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
exports.default = {
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.userAtActivity.findMany();
            return response;
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.userAtActivity.findFirst({
                where: {
                    id
                }
            });
            return response;
        });
    },
    findManyByActivityId(activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.userAtActivity.findMany({
                where: {
                    activityId: activityId
                },
                include: {
                    user: true
                }
            });
            return response;
        });
    },
    findManyByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.userAtActivity.findMany({
                where: {
                    userId,
                },
                include: {
                    user: true
                }
            });
            return response;
        });
    },
    findByUserIdAndActivityId(userId, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.userAtActivity.findFirst({
                where: {
                    userId,
                    activityId,
                }
            });
            return response;
        });
    },
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.userAtActivity.create({
                data
            });
            return response;
        });
    },
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.userAtActivity.update({
                data,
                where: {
                    id
                }
            });
            return response;
        });
    },
    findFirstInWaitlist(activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client.userAtActivity.findFirst({
                where: {
                    activityId: activityId,
                    listaEspera: true
                },
                orderBy: {
                    createdAt: 'asc' // Ordena para pegar o primeiro da lista de espera
                }
            });
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client.userAtActivity.delete({
                where: {
                    id
                }
            });
        });
    }
};
