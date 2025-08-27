import { Router } from "express";
import { authMiddleware } from '../middlewares/authMiddleware';
import { adminMiddleware } from '../middlewares/adminMiddleware';
import tagsController from "../controllers/tagsController";

const routes = Router();

routes.get("/", tagsController.list);
routes.post("/", authMiddleware, adminMiddleware, tagsController.create);
routes.patch("/:id", authMiddleware, adminMiddleware, tagsController.update);
routes.delete("/:id", authMiddleware, adminMiddleware, tagsController.delete);

export default routes;
