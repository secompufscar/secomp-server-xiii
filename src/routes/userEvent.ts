import { Router } from "express";
import userEventController from '../controllers/userEventController';
import { authMiddleware } from '../middlewares/authMiddleware';

const routes = Router();

/**
 * @swagger
 * tags:
 *   name: UserEvents
 *   description: Inscrições de usuários em eventos
 */

/**
 * @swagger
 * /user-events/event/{eventId}:
 *   get:
 *     tags: [UserEvents]
 *     summary: Lista inscrições de um evento
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de inscrições
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserEventDTO'
 */
routes.get('/event/:eventId', userEventController.findByEventId);

/**
 * @swagger
 * /user-events/user/{userId}:
 *   get:
 *     tags: [UserEvents]
 *     summary: Lista eventos de um usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de inscrições do usuário
 *       401:
 *         description: Não autorizado
 */
routes.get('/user/:userId', authMiddleware, userEventController.findByUserId);

/**
 * @swagger
 * /user-events:
 *   post:
 *     tags: [UserEvents]
 *     summary: Inscreve usuário no evento atual
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               eventId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inscrição realizada
 *       400:
 *         description: Usuário já está inscrito
 *       401:
 *         description: Não autorizado
 */
routes.post('/', authMiddleware, userEventController.create);

/**
 * @swagger
 * /user-events/{id}:
 *   delete:
 *     tags: [UserEvents]
 *     summary: Remove inscrição de usuário
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Inscrição removida
 *       404:
 *         description: Inscrição não encontrada
 *       401:
 *         description: Não autorizado
 */
routes.delete('/:id', authMiddleware, userEventController.delete);

export default routes;