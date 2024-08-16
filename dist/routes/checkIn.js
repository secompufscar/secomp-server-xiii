"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const checkInController_1 = __importDefault(require("../controllers/checkInController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
/**
 * @swagger
 * /check-in/{userId}/{activityId}:
 *   post:
 *     summary: Realiza o check-in de um usuário em uma atividade.
 *     tags:
 *       - Check-In
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário que está fazendo o check-in.
 *         schema:
 *           type: string
 *       - in: path
 *         name: activityId
 *         required: true
 *         description: ID da atividade em que o usuário está fazendo check-in.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Check-in realizado com sucesso.
 *       404:
 *         description: Usuário ou atividade não encontrados.
 *       400:
 *         description: Solicitação inválida, como check-in já realizado ou atividade inexistente.
 */
router.post('/:userId/:activityId', authMiddleware_1.authMiddleware, checkInController_1.default.checkIn);
/**
 * @swagger
 * /check-in/participants/{activityId}:
 *   get:
 *     summary: Lista todos os participantes de uma atividade.
 *     tags:
 *       - Check-In
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         description: ID da atividade para listar os participantes.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de participantes retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   userId:
 *                     type: string
 *                   activityId:
 *                     type: string
 *       404:
 *         description: Atividade não encontrada ou sem participantes.
 */
router.get('/participants/:activityId', authMiddleware_1.authMiddleware, checkInController_1.default.listParticipants);
exports.default = router;
