import { Router } from 'express'

import adminController from '../controllers/adminController'

import { adminMiddleware } from '../middlewares/adminMiddleware'

const routes = Router()

routes.use(adminMiddleware)
routes.post('/create', adminController.create)
routes.put('/edit', adminController.update)
routes.delete('/delete', adminController.delete)


export default routes