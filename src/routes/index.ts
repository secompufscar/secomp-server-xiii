import { Router } from "express"

import usersRoutes from "./users"
import activitiesRoutes from "./activities"
import adminRoutes from "./admin"
import usersAtActivitiesRoutes from "./usersAtActivities"
import categoriesRoutes from "./categories"
//import diretoriasRoutes from "./diretorias"
import checkInRoutes from "./checkIn"
import notificationsRoutes from "./notifications"

const routes = Router()

routes.use('/activities', activitiesRoutes)
routes.use('/users', usersRoutes)
routes.use('/categories', categoriesRoutes)
routes.use('/userAtActivities', usersAtActivitiesRoutes)
routes.use('/notifications', notificationsRoutes)
routes.use('/admin', adminRoutes)
//routes.use('/diretorias', diretoriasRoutes)
routes.use('/checkIn', checkInRoutes)

export default routes
