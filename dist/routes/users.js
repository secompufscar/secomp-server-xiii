"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usersController_1 = __importDefault(require("../controllers/usersController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const routes = (0, express_1.Router)();
/**
 * @swagger
 * /signup:
 *   post:
 *     summary: User signup
 *     description: Register a new user.
 *     requestBody:
 *       description: User signup details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: user123
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user123@example.com
 *               senha:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
routes.post('/signup', usersController_1.default.signup);
/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticate a user and return a token.
 *     requestBody:
 *       description: User login details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user123@example.com
 *               senha:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Unauthorized
 */
routes.post('/login', usersController_1.default.login);
/**
 * @swagger
 * /getProfile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: user123
 *                 email:
 *                   type: string
 *                   format: email
 *                   example: user123@example.com
 *       401:
 *         description: Unauthorized
 */
routes.get('/getProfile', authMiddleware_1.authMiddleware, usersController_1.default.getProfile);
/**
 * @swagger
 * /confirmation/{token}:
 *   get:
 *     summary: Confirmação de email
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de confirmação de email para um determinado usuario.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário com email confirmado corretamente
  *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 confirmed:
 *                   type: boolean
 *       500:
 *         description: Internal server error
 */
routes.get('/confirmation/:token', usersController_1.default.confirmEmail);
/**
 * @swagger
 * /updatePassword/{token}:
 *   get:
 *     summary: Altera a senha de um usuário.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de reset de senha
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário com senha alterada corretamente
  *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 nome:
 *                   type: string
 *                 email:
 *                   type: string
 *                 tipo:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 confirmed:
 *                   type: booleam
 *       500:
 *         description: Internal server error
 */
routes.get('/updatePassword/:token', usersController_1.default.updateForgottenPassword);
/**
 * @swagger
 * /sendForgotPasswordEmail:
 *   post:
 *     summary: Envia um email para um usuário que esqueceu sua senha.
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *               nome:
 *                 type: string
 *                 example: "Fulano da Silva"
 *               tipo:
 *                 type: string
 *                 example: "USER"
 *               qrCode:
 *                 type: string
 *                 example: "fwaegfaiwyegfiawegfkhagekfgogqowgfayuwegfka"
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-31T14:37:41.050Z"
 *               updatedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-08-31T14:37:41.050Z"
 *               confirmed:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: Email de alteração de senha enviado corretamente
 *       500:
 *         description: Internal server error
 */
routes.post('/sendForgotPasswordEmail', authMiddleware_1.authMiddleware, usersController_1.default.sendForgotPasswordEmail);
exports.default = routes;
