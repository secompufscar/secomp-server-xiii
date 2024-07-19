import { Router } from 'express'

import usersAtActivitiesController from '../controllers/usersAtActivitiesController'

import { authMiddleware } from '../middlewares/authMiddleware'

const routes = Router()

routes.get('/:activityId', authMiddleware, usersAtActivitiesController.findById)
routes.get('/all-activities/:userId', authMiddleware, usersAtActivitiesController.findByUserId)
routes.post('/', authMiddleware, usersAtActivitiesController.create)
routes.put('/:activityId/:id', authMiddleware, usersAtActivitiesController.update)
routes.delete('/:activityId/:id', authMiddleware, usersAtActivitiesController.delete)


export default routes
