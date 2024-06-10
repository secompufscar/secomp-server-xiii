import {Router} from 'express'
import { getProfile, signup } from '../controllers/auth'
import { login } from '../controllers/auth'
import { authMiddleware } from '../middlewares/authMiddleware'

const authRoutes: Router = Router()

authRoutes.post('/signup', signup)
authRoutes.post('/login', login)

// Usar authMiddleware para proteger rotas
authRoutes.get('/getProfile', authMiddleware, getProfile)

export default authRoutes