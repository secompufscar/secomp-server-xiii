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
const client_2 = require("@prisma/client");
7;
// import { prismaClient } from "@middlewares/authMiddleware"
const client = new client_1.PrismaClient();
exports.default = {
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.user.findMany();
            // Mapeia a resposta e faz a asserção de tipo em cada item
            return response.map(user => (Object.assign(Object.assign({}, user), { registrationStatus: user.registrationStatus })));
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.user.findFirst({
                where: { id }
            });
            if (!response) {
                return null;
            }
            // Faz a asserção de tipo antes de retornar
            return Object.assign(Object.assign({}, response), { registrationStatus: response.registrationStatus });
        });
    },
    setRegistrationStatusForAllEligibleUsers(newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`[userRepository.setRegistrationStatusForAllEligibleUsers] Tentando atualizar registrationStatus para ${newStatus} para usuários elegíveis.`);
                const updateResult = yield client.user.updateMany({
                    where: {
                        registrationStatus: { not: newStatus }
                    },
                    data: {
                        registrationStatus: newStatus
                    }
                });
                console.log(`[userRepository.setRegistrationStatusForAllEligibleUsers] Status de registro atualizado para ${newStatus}. Usuários afetados: ${updateResult.count}`);
            }
            catch (error) {
                console.error(`[userRepository.setRegistrationStatusForAllEligibleUsers] Erro ao atualizar registrationStatus dos usuários elegíveis:`, error);
                throw error;
            }
        });
    },
    updateUserEventStatus(userId, registrationStatusInput, currentEdition) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.user.update({
                where: { id: userId },
                data: {
                    registrationStatus: registrationStatusInput, // Prisma aceita number aqui para a escrita
                    currentEdition: currentEdition.toString()
                }
            });
            return Object.assign(Object.assign({}, response), { registrationStatus: response.registrationStatus });
        });
    },
    setRegistrationStatusForUsers(userIds, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userIds.length === 0) {
                return;
            }
            yield client.user.updateMany({
                where: {
                    id: { in: userIds }
                },
                data: {
                    registrationStatus: newStatus
                }
            });
        });
    },
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.user.findFirst({
                where: { email }
            });
            // Se não encontrar o usuário, retorna nulo.
            if (!response) {
                return null;
            }
            // Faz a asserção de tipo antes de retornar o usuário.
            return Object.assign(Object.assign({}, response), { registrationStatus: response.registrationStatus });
        });
    },
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.user.create({ data });
            return Object.assign(Object.assign({}, response), { registrationStatus: response.registrationStatus });
        });
    },
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.user.update({
                data,
                where: { id }
            });
            return Object.assign(Object.assign({}, response), { registrationStatus: response.registrationStatus });
        });
    },
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield client.user.delete({ where: { id } });
        });
    },
    updateQRCode(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield client.user.update({
                data, // UpdateQrCodeUsersDTOS deve ser compatível com os campos que User.update aceita para 'data'
                where: { id }
            });
            // Faz a asserção de tipo
            return Object.assign(Object.assign({}, response), { registrationStatus: response.registrationStatus });
        });
    },
    getUserRanking(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield client.$queryRaw(client_2.Prisma.sql `
              SELECT COUNT(*) + 1 AS \`rank\`
              FROM (
                SELECT
                  u.id,
                  u.points,
                  COUNT(CASE WHEN ua.presente = 1 THEN 1 END) AS presences,
                  u.createdAt
                FROM \`users\` u
                LEFT JOIN \`userAtActivity\` ua ON ua.userId = u.id
                GROUP BY u.id, u.points, u.createdAt
              ) AS other_users
              WHERE (
                other_users.points > (
                  SELECT points FROM \`users\` WHERE id = ${id}
                )
                OR (
                  other_users.points = (
                    SELECT points FROM \`users\` WHERE id = ${id}
                  ) AND other_users.presences > (
                    SELECT COUNT(*) FROM \`userAtActivity\`
                    WHERE userId = ${id} AND presente = 1
                  )
                )
                OR (
                  other_users.points = (
                    SELECT points FROM \`users\` WHERE id = ${id}
                  ) AND other_users.presences = (
                    SELECT COUNT(*) FROM \`userAtActivity\`
                    WHERE userId = ${id} AND presente = 1
                  ) AND other_users.createdAt < (
                    SELECT createdAt FROM \`users\` WHERE id = ${id}
                  )
                )
              );
            `);
            if (result.length === 0) {
                throw new Error('Não foi possivel recuperar o ranking');
            }
            return Number(result[0].rank);
        });
    }
};
