import { Router } from 'express'

import usersController from '../controllers/usersController'
import { authMiddleware } from '../middlewares/authMiddleware'

const routes = Router()

routes.post('/signup', usersController.signup)
routes.post('/login', usersController.login)
routes.get('/getProfile', authMiddleware, usersController.getProfile)

export default routes