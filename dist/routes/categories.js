"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriesController_1 = __importDefault(require("../controllers/categoriesController"));
const categorySchema_1 = require("../schemas/categorySchema");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const validate_1 = __importDefault(require("../middlewares/validate"));
const routes = (0, express_1.Router)();
/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Obtém uma lista de todas as categorias.
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Lista de categorias retornada com sucesso.
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
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 */
//routes.get('/', authMiddleware, categoriesController.list);
routes.get('/', categoriesController_1.default.list);
/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Obtém uma categoria específica pelo ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria que deseja obter.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Categoria não encontrada.
 */
//routes.get('/:id', authMiddleware, validate(undefined, categoryIdSchema), categoriesController.findById);
routes.get('/:id', categoriesController_1.default.findById);
/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Cria uma nova categoria.
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Categoria criada com sucesso.
 */
//routes.post('/', authMiddleware, validate(createCategorySchema), categoriesController.create);
routes.post('/', categoriesController_1.default.create);
/**
 * @swagger
 * /categories/{id}:
 *   put:
 *     summary: Atualiza uma categoria existente pelo ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria que deseja atualizar.
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
 *     responses:
 *       200:
 *         description: Categoria atualizada com sucesso.
 *       404:
 *         description: Categoria não encontrada.
 */
routes.put('/:id', authMiddleware_1.authMiddleware, (0, validate_1.default)(categorySchema_1.updateCategorySchema, categorySchema_1.categoryIdSchema), categoriesController_1.default.update);
/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Deleta uma categoria pelo ID.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID da categoria que deseja deletar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Categoria deletada com sucesso.
 *       404:
 *         description: Categoria não encontrada.
 */
routes.delete('/:id', authMiddleware_1.authMiddleware, (0, validate_1.default)(undefined, categorySchema_1.categoryIdSchema), categoriesController_1.default.delete);
exports.default = routes;
