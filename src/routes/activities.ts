import { Router } from 'express'

import activitiesController from '../controllers/activitiesController'

import { createActivitySchema, activityIdSchema, updateActivitySchema} from '../schemas/activitySchema'

import { authMiddleware } from '../middlewares/authMiddleware'
import validate from '../middlewares/validate'

const routes = Router()

routes.get('/', authMiddleware, activitiesController.list)
routes.get('/:id', authMiddleware, validate(undefined, activityIdSchema), activitiesController.findById)
routes.post('/', authMiddleware, validate(createActivitySchema), activitiesController.create)
routes.put('/:id', authMiddleware, validate(updateActivitySchema, activityIdSchema), activitiesController.update)
routes.delete('/:id', authMiddleware, validate(undefined, activityIdSchema), activitiesController.delete)

export default routes
