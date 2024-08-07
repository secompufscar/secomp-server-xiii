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
    findUserAtActivity(userId, activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client.userAtActivity.findFirst({
                where: {
                    userId,
                    activityId
                }
            });
        });
    },
    markAsPresent(userAtActivityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client.userAtActivity.update({
                where: { id: userAtActivityId },
                data: { presente: true }
            });
        });
    },
    // async createWaitlistEntry(userId: string, activityId: string): Promise<UserAtActivity> {
    //     return await client.userAtActivity.create({
    //         data: {
    //             userId,
    //             activityId,
    //             inscricaoPrevia: false,
    //             listaEspera: true,
    //             presente: false
    //         }
    //     });
    // },
    findParticipantsByActivity(activityId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client.userAtActivity.findMany({
                where: {
                    activityId,
                },
                include: {
                    user: true
                }
            });
        });
    },
};
