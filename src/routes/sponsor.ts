import { Router } from "express";
import sponsorsController from "../controllers/sponsorController";
import sponsorsOnTagsController from "../controllers/sponsorOnTagsController";

const routes = Router();

// Rota principal para listar todos os patrocinadores
routes.get("/", sponsorsController.list);

routes.get("/:id", sponsorsController.getOne);

// Rotas para gerenciar a relação entre um patrocinador e suas tags
routes.post("/:sponsorId/tags", sponsorsOnTagsController.link);
routes.delete("/:sponsorId/tags/:tagId", sponsorsOnTagsController.unlink);
routes.post("/", sponsorsController.create);
routes.patch("/:id", sponsorsController.update);
routes.delete("/:id", sponsorsController.delete);

export default routes;
