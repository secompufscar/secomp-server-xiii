import { Router } from "express"

import usersRoutes from "./users"
import activitiesRoutes from "./activities"
import adminRoutes from "./admin"
import usersAtActivitiesRoutes from "./usersAtActivities"
import categoriesRoutes from "./categories"
//import diretoriasRoutes from "./diretorias"
import checkInRoutes from "./checkIn"

const routes = Router()

routes.use('/activities', activitiesRoutes)
routes.use('/users', usersRoutes)
routes.use('/categories', categoriesRoutes)
routes.use('/userAtActivities', usersAtActivitiesRoutes)
routes.use('/admin', adminRoutes)
//routes.use('/diretorias', diretoriasRoutes)
routes.use('/checkIn', checkInRoutes)

routes.get('/', (_, response) => response.status(200).json({ message: "API SECOMP XII" }))

export default routes
