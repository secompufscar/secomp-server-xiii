import { Router } from 'express'

import usersAtActivitiesController from '../controllers/usersAtActivitiesController'

import { authMiddleware } from '../middlewares/authMiddleware'

const routes = Router()

//Fazer o swagger
routes.get('/:userId/:activityId', usersAtActivitiesController.findByUserIdActivityId)

/**
 * @swagger
 * /userAtActivities/{activityId}:
 *   get:
 *     summary: Obtém todas as inscrições de usuários para uma atividade específica.
 *     tags: 
 *       - UserAtActivities
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         description: ID da atividade para a qual deseja obter as inscrições.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de inscrições retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   userId:
 *                     type: string
 *                   activityId:
 *                     type: string
 *                   presente:
 *                     type: boolean
 *                   inscricaoPrevia:
 *                     type: boolean
 *                   listaEspera:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Atividade não encontrada.
 */
routes.get('/:activityId', authMiddleware, usersAtActivitiesController.findById)
/**
 * @swagger
 * /userAtActivities/all-activities/{userId}:
 *   get:
 *     summary: Obtém todas as atividades de um usuário.
 *     tags: 
 *       - UserAtActivities
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID do usuário.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de atividades retornada com sucesso.
 */
routes.get('/all-activities/:userId', authMiddleware, usersAtActivitiesController.findByUserId);
/**
 * @swagger
 * /userAtActivities:
 *   post:
 *     summary: Cria uma nova inscrição para o usuário em uma atividade.
 *     tags: 
 *       - UserAtActivities
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *               activityId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Inscrição criada com sucesso.
 */
routes.post('/', usersAtActivitiesController.create);
/**
 * @swagger
 * /userAtActivities/{id}:
 *   put:
 *     summary: Atualiza uma inscrição de um usuário em uma atividade.
 *     tags: 
 *       - UserAtActivities
 *     parameters:
 *       - in: path
 *         name: activityId
 *         required: true
 *         description: ID da atividade.
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da inscrição do usuário.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               presente:
 *                 type: boolean
 *               inscricaoPrevia:
 *                 type: boolean
 *               listaEspera:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Inscrição atualizada com sucesso.
 */
routes.put('/:id', authMiddleware, usersAtActivitiesController.update);
/**
 * @swagger
 * /userAtActivities/{id}:
 *   delete:
 *     summary: Deleta uma inscrição de um usuário em uma atividade.
 *     tags: 
 *       - UserAtActivities
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da inscrição do usuário na atividade.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Inscrição deletada com sucesso.
 *       404:
 *         description: Registro não encontrado.
 */
routes.delete('/:userId/:activityId', usersAtActivitiesController.delete);

export default routes;