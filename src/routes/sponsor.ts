import { Router } from "express";
import sponsorsController from "../controllers/sponsorController";
import sponsorsOnTagsController from "../controllers/sponsorOnTagsController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const routes = Router();

routes.get("/", sponsorsController.list);
routes.get("/:id", sponsorsController.getOne);
routes.post("/:sponsorId/tags", authMiddleware, adminMiddleware, sponsorsOnTagsController.link);
routes.delete("/:sponsorId/tags/:tagId", authMiddleware, adminMiddleware, sponsorsOnTagsController.unlink);
routes.post("/", adminMiddleware, authMiddleware, sponsorsController.create);
routes.patch("/:id", adminMiddleware, authMiddleware, sponsorsController.update);
routes.delete("/:id", adminMiddleware, authMiddleware, sponsorsController.delete);

export default routes;
