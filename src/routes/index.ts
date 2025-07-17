import { Router } from "express";

import usersRoutes from "./users";
import activitiesRoutes from "./activities";
import adminRoutes from "./admin";
import usersAtActivitiesRoutes from "./usersAtActivities";
import categoriesRoutes from "./categories";
//import diretoriasRoutes from "./diretorias"
import checkInRoutes from "./checkIn"
import eventRoutes from "./event"
import userEventRoutes from "./userEvent"

const routes = Router()

routes.use("/activities", activitiesRoutes);
routes.use("/users", usersRoutes);
routes.use("/categories", categoriesRoutes);
routes.use("/userAtActivities", usersAtActivitiesRoutes);
routes.use("/admin", adminRoutes);
//routes.use('/diretorias', diretoriasRoutes)
routes.use('/checkIn', checkInRoutes)
routes.use('/event', eventRoutes)
routes.use('/userEvent', userEventRoutes)
export default routes
