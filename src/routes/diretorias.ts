import { Router } from 'express'

import diretoriasController from '../controllers/diretoriasController'

import { authMiddleware } from '../middlewares/authMiddleware'

const routes = Router()

routes.get('/', authMiddleware, diretoriasController.list)
routes.get('/:id', authMiddleware, diretoriasController.findById)
routes.post('/', authMiddleware,  diretoriasController.create)
routes.put('/:id', authMiddleware, diretoriasController.update)
routes.delete('/:id', authMiddleware, diretoriasController.delete)

export default routes
