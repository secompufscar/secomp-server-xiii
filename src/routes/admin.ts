import { Router } from 'express'

import adminController from '../controllers/adminController'

import { adminMiddleware } from '../middlewares/adminMiddleware'
import { verifyTokenMiddleware } from '../middlewares/verifyTokenMiddleware'

const routes = Router()

routes.use(verifyTokenMiddleware)
routes.use(adminMiddleware)
routes.post('/create', adminController.create)
routes.put('/edit', adminController.update)
routes.delete('/delete', adminController.delete)


export default routes