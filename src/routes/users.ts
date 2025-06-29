import { Router } from 'express'
import usersController from '../controllers/usersController'
import { authMiddleware } from '../middlewares/authMiddleware'

const routes = Router()

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
routes.post('/signup', usersController.signup)
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
routes.post('/login', usersController.login)
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
routes.get('/getProfile', authMiddleware, usersController.getProfile)

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
routes.get('/confirmation/:token', usersController.confirmEmail)

/**
 * @swagger
 * /updatePassword/{token}:
 *   patch:
 *     summary: Altera a senha de um usuário.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         description: Token de reset de senha
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senha:
 *                 type: string
 *                 example: "novaSenha123"
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
 *                   type: boolean
 *       500:
 *         description: Internal server error
 */
routes.patch('/updatePassword/:token', usersController.updateForgottenPassword)

/**
 * @swagger
 * /sendForgotPasswordEmail:
 *   post:
 *     summary: Envia um email para um usuário que esqueceu sua senha.
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "usuario@example.com"
 *     responses:
 *       200:
 *         description: Email de alteração de senha enviado 
 *       500:
 *         description: Internal server error
 */
routes.post('/sendForgotPasswordEmail', usersController.sendForgotPasswordEmail)

/**
 * @swagger
 * /getUserRanking/{id}:
 *   get:
 *     summary: Retorna o ranking de um usuário
 *     description: Retorna informações de ranking do usuário com base no ID fornecido.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Ranking do usuário recuperado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ranking:
 *                   type: integer
 *                   example: 5
 *                 pontos:
 *                   type: integer
 *                   example: 1200
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
routes.get('/getUserRanking/:id', usersController.getUserRanking)

export default routes