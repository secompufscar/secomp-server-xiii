import { Router } from "express";
import activityImageController from "../controllers/activityImageController";
import multer from "multer";

const upload = multer({storage: multer.memoryStorage()})

const routes = Router();

routes.post('/upload',upload.single("image"),activityImageController.create);

export default routes;