import { Router } from "express";
import activityImageController from "../controllers/activityImageController";
import multer from "multer";

const upload = multer({storage: multer.memoryStorage()})

const routes = Router();

routes.get('/list/',activityImageController.list);

routes.get('/activityId/:id',activityImageController.findByActivityId)

routes.get('/:id',activityImageController.findById);

routes.put('/:id',upload.single("image"),activityImageController.updateById);

routes.post('/',upload.single("image"),activityImageController.create);

routes.delete('/:id',activityImageController.delete);


export default routes;