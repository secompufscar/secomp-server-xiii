"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const activitiesController_1 = __importDefault(require("../controllers/activitiesController"));
const activitySchema_1 = require("../schemas/activitySchema");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validate_1 = __importDefault(require("../middlewares/validate"));
const routes = (0, express_1.Router)();
/**
 * @swagger
 * /activities:
 *   get:
 *     summary: Obtém uma lista de todas as atividades.
 *     tags:
 *       - Activities
 *     responses:
 *       200:
 *         description: Lista de atividades retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   nome:
 *                     type: string
 *                   data:
 *                     type: string
 *                     format: date-time
 *                   vagas:
 *                     type: integer
 *                   detalhes:
 *                     type: string
 *                   palestranteNome:
 *                     type: string
 *                   categoriaId:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
routes.get('/', authMiddleware_1.authMiddleware, activitiesController_1.default.list);
/**
 * @swagger
 * /activities/{id}:
 *   get:
 *     summary: Obtém uma atividade específica pelo ID.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade que deseja obter.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Atividade retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 data:
 *                   type: string
 *                   format: date-time
 *                 vagas:
 *                   type: integer
 *                 detalhes:
 *                   type: string
 *                 palestranteNome:
 *                   type: string
 *                 categoriaId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Atividade não encontrada.
 */
routes.get('/:id', authMiddleware_1.authMiddleware, (0, validate_1.default)(undefined, activitySchema_1.activityIdSchema), activitiesController_1.default.findById);
/**
 * @swagger
 * /activities:
 *   post:
 *     summary: Cria uma nova atividade.
 *     tags:
 *       - Activities
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               data:
 *                 type: string
 *                 format: date-time
 *               vagas:
 *                 type: integer
 *               detalhes:
 *                 type: string
 *               palestranteNome:
 *                 type: string
 *               categoriaId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Atividade criada com sucesso.
 */
routes.post('/', authMiddleware_1.authMiddleware, (0, validate_1.default)(activitySchema_1.createActivitySchema), activitiesController_1.default.create);
/**
 * @swagger
 * /activities/{id}:
 *   put:
 *     summary: Atualiza uma atividade existente pelo ID.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade que deseja atualizar.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               data:
 *                 type: string
 *                 format: date-time
 *               vagas:
 *                 type: integer
 *               detalhes:
 *                 type: string
 *               palestranteNome:
 *                 type: string
 *               categoriaId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Atividade atualizada com sucesso.
 *       404:
 *         description: Atividade não encontrada.
 */
routes.put('/:id', authMiddleware_1.authMiddleware, (0, validate_1.default)(activitySchema_1.updateActivitySchema, activitySchema_1.activityIdSchema), activitiesController_1.default.update);
/**
 * @swagger
 * /activities/{id}:
 *   delete:
 *     summary: Deleta uma atividade pelo ID.
 *     tags:
 *       - Activities
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da atividade que deseja deletar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Atividade deletada com sucesso.
 *       404:
 *         description: Atividade não encontrada.
 */
routes.delete('/:id', authMiddleware_1.authMiddleware, (0, validate_1.default)(undefined, activitySchema_1.activityIdSchema), activitiesController_1.default.delete);
exports.default = routes;
