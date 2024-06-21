import {Router} from 'express'
import { createUser } from '../controllers/admin/createUser'
import { updateUser } from '../controllers/admin/updateUser'
import { deleteUserByEmail } from '../controllers/admin/deleteUser'
import { adminMiddleware } from '../middlewares/adminMiddleware'

const adminRoutes: Router = Router()

adminRoutes.use(adminMiddleware)
adminRoutes.post('/create', createUser)
adminRoutes.put('/edit', updateUser)
adminRoutes.delete('/delete', deleteUserByEmail)


export default adminRoutes