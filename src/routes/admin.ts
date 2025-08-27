import { Router } from "express";
import { adminMiddleware } from "../middlewares/adminMiddleware";
import adminController from "../controllers/adminController";

const routes = Router();

routes.use(adminMiddleware);
routes.post("/create", adminController.create);
routes.put("/edit", adminController.update);
routes.delete("/delete", adminController.delete);

export default routes;
