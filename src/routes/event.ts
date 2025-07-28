import { Router } from "express";
import eventController from "../controllers/eventController";
import { createEventSchema, eventIdSchema, updateEventSchema } from "../schemas/eventSchema";
import validate from "../middlewares/validate";
import { authMiddleware } from "../middlewares/authMiddleware";

const routes = Router();

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: Gerenciamento de eventos
 */

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Lista todos os eventos
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
routes.get("/", eventController.list);

/**
 * @swagger
 * /events/current:
 *   get:
 *     summary: Retorna o evento ativo atual
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Evento ativo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Nenhum evento ativo encontrado
 */
routes.get("/current", eventController.findCurrent);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Obtém um evento pelo ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Evento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Evento não encontrado
 */
routes.get("/:id", validate(undefined, eventIdSchema), eventController.findById);

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Cria um novo evento
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEvent'
 *     responses:
 *       201:
 *         description: Evento criado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       400:
 *         description: Dados inválidos
 */
routes.post("/", validate(createEventSchema), eventController.create);

/**
 * @swagger
 * /events/{id}:
 *   put:
 *     summary: Atualiza um evento existente
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEvent'
 *     responses:
 *       200:
 *         description: Evento atualizado
 *       404:
 *         description: Evento não encontrado
 */
routes.put("/:id", validate(updateEventSchema, eventIdSchema), eventController.update);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Remove um evento
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Evento removido
 *       404:
 *         description: Evento não encontrado
 */
routes.delete("/:id", validate(undefined, eventIdSchema), eventController.delete);

export default routes;
