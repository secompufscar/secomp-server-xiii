import { Router } from 'express'

import categoriesController from '../controllers/categoriesController'

import { createCategorySchema, updateCategorySchema, categoryIdSchema } from '../schemas/categorySchema'

import { authMiddleware } from '../middlewares/authMiddleware'
import validate from '../middlewares/validate'

const routes = Router()

routes.get('/', authMiddleware, categoriesController.list)
routes.get('/:id',authMiddleware, validate(undefined, categoryIdSchema), categoriesController.findById)
routes.post('/',authMiddleware ,validate(createCategorySchema), categoriesController.create)
routes.put('/:id',authMiddleware, validate(updateCategorySchema, categoryIdSchema),categoriesController.update)
routes.delete('/:id',authMiddleware, validate(undefined, categoryIdSchema), categoriesController.delete)

export default routes
